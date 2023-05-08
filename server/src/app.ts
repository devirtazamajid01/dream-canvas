import express, { Application } from 'express'
import cors from 'cors'
import { config, validateEnv } from './config/config'
import { dbConnect } from './config/dbConnect'
import { imageRouter } from './routes/image.route'
import {
  errorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
} from './middleware/errorHandler'
import {
  securityHeaders,
  requestLogger,
  corsOptions,
  generalRateLimit,
  imageGenerationRateLimit,
} from './middleware/security'
import { logger } from './utils/logger'

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException()
handleUnhandledRejection()

export const app: Application = express()

// Validate environment variables
validateEnv()

// Security middleware
app.use(securityHeaders)

// Request logging
app.use(requestLogger)

// CORS configuration
app.use(cors(corsOptions))

// Rate limiting
app.use(generalRateLimit)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Disable x-powered-by header
app.disable('x-powered-by')

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.env,
  })
})

// API routes
app.use('/api/image', imageGenerationRateLimit, imageRouter)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    code: 404,
    path: req.originalUrl,
  })
})

// Global error handler (must be last)
app.use(errorHandler)

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await dbConnect()

    // Start listening
    app.listen(config.port, () => {
      logger.info(`🚀 Server running at http://localhost:${config.port}`, {
        environment: config.env,
        port: config.port,
      })
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

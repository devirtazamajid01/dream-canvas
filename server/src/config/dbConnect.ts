import mongoose from 'mongoose'
import { config } from './config'
import { logger } from '../utils/logger'
import { DatabaseError } from '../errors'

// MongoDB connection options
const mongoOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  family: 4, // Use IPv4, skip trying IPv6
}

// MongoDB connection event handlers
const setupMongoEventHandlers = (): void => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected successfully', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      database: mongoose.connection.name,
    })
  })

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error:', {
      error: error.message,
      stack: error.stack,
    })
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected')
  })

  // Handle application termination
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close()
      logger.info('MongoDB connection closed through app termination')
      process.exit(0)
    } catch (error) {
      logger.error('Error closing MongoDB connection:', error)
      process.exit(1)
    }
  })
}

// Database connection function
export const dbConnect = async (): Promise<void> => {
  try {
    // Configure Mongoose settings
    mongoose.set('bufferCommands', false) // Disable mongoose buffering

    // Setup event handlers
    setupMongoEventHandlers()

    // Connect to MongoDB
    await mongoose.connect(config.databaseUrl, mongoOptions)

    logger.info('Database connection established successfully')
  } catch (error) {
    const errorMessage = `Database connection failed: ${
      error instanceof Error ? error.message : 'Unknown error'
    }`
    logger.error(errorMessage, { error })

    // Throw a custom error instead of exiting the process
    throw new DatabaseError(errorMessage)
  }
}

// Graceful database disconnection
export const dbDisconnect = async (): Promise<void> => {
  try {
    await mongoose.connection.close()
    logger.info('Database connection closed gracefully')
  } catch (error) {
    logger.error('Error closing database connection:', error)
    throw new DatabaseError('Failed to close database connection')
  }
}

import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'
import { logger } from '../utils/logger'

interface ErrorResponse {
  success: false
  message: string
  code: number
  timestamp: string
  path: string
  method: string
  stack?: string
  details?: unknown
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500
  let message = 'Internal Server Error'
  let isOperational = false

  // Handle known AppError instances
  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    isOperational = error.isOperational
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation Error'
    isOperational = true
  }
  // Handle Mongoose cast errors
  else if (error.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
    isOperational = true
  }
  // Handle Mongoose duplicate key errors
  else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409
    message = 'Duplicate field value'
    isOperational = true
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
    isOperational = true
  }
  // Handle JWT expired errors
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
    isOperational = true
  }
  // Handle OpenAI API errors
  else if (error.name === 'OpenAIError') {
    statusCode = 502
    message = 'AI service temporarily unavailable'
    isOperational = true
  }

  // Log error details
  const errorDetails = {
    message: error.message,
    stack: error.stack,
    statusCode,
    isOperational,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
  }

  if (statusCode >= 500) {
    logger.error('Server Error:', errorDetails)
  } else {
    logger.warn('Client Error:', errorDetails)
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    code: statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack
    errorResponse.details = errorDetails
  }

  // Include validation details for validation errors
  if (error.name === 'ValidationError') {
    errorResponse.details = (error as any).errors
  }

  res.status(statusCode).json(errorResponse)
}

// Handle unhandled promise rejections
export const handleUnhandledRejection = (): void => {
  process.on(
    'unhandledRejection',
    (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Promise Rejection:', {
        reason,
        promise,
        timestamp: new Date().toISOString(),
      })

      // Close server & exit process
      process.exit(1)
    }
  )
}

// Handle uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })

    // Close server & exit process
    process.exit(1)
  })
}

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

import { ApiError } from '@/types/api'

export class AppError extends Error {
    public readonly code: number
    public readonly isOperational: boolean

    constructor(
        message: string,
        code: number = 500,
        isOperational: boolean = true
    ) {
        super(message)
        this.name = 'AppError'
        this.code = code
        this.isOperational = isOperational

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400)
        this.name = 'ValidationError'
    }
}

export class NetworkError extends AppError {
    constructor(message: string = 'Network error occurred') {
        super(message, 0, false)
        this.name = 'NetworkError'
    }
}

export class TimeoutError extends AppError {
    constructor(message: string = 'Request timeout') {
        super(message, 408, false)
        this.name = 'TimeoutError'
    }
}

// Error handling utilities
export const handleApiError = (error: unknown): string => {
    if (error instanceof AppError) {
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === 'string') {
        return error
    }

    return 'An unexpected error occurred'
}

export const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'success' in error &&
        'message' in error &&
        'code' in error &&
        (error as ApiError).success === false
    )
}

export const extractErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.message
    }

    if (error instanceof AppError) {
        return error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    if (typeof error === 'string') {
        return error
    }

    return 'An unexpected error occurred'
}

// Retry utility for failed requests
export const withRetry = async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: Error

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            lastError =
                error instanceof Error ? error : new Error(String(error))

            if (attempt === maxRetries) {
                throw lastError
            }

            // Don't retry on certain error types
            if (error instanceof ValidationError) {
                throw error
            }

            // Exponential backoff
            await new Promise((resolve) =>
                setTimeout(resolve, delay * Math.pow(2, attempt - 1))
            )
        }
    }

    throw lastError!
}

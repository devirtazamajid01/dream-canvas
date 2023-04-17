import { ValidationError } from './errorHandler'

// Input validation utilities
export const validatePrompt = (prompt: string): void => {
    if (!prompt || typeof prompt !== 'string') {
        throw new ValidationError('Prompt is required')
    }

    const trimmedPrompt = prompt.trim()

    if (trimmedPrompt.length === 0) {
        throw new ValidationError('Prompt cannot be empty')
    }

    if (trimmedPrompt.length < 3) {
        throw new ValidationError('Prompt must be at least 3 characters long')
    }

    if (trimmedPrompt.length > 1000) {
        throw new ValidationError('Prompt must be less than 1000 characters')
    }

    // Check for potentially harmful content
    const harmfulPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^>]*>/gi,
        /<object\b[^>]*>/gi,
        /<embed\b[^>]*>/gi,
    ]

    for (const pattern of harmfulPatterns) {
        if (pattern.test(trimmedPrompt)) {
            throw new ValidationError(
                'Prompt contains potentially harmful content'
            )
        }
    }
}

export const validateImageSize = (size: string): void => {
    const validSizes = ['Small', 'Medium', 'Large']

    if (!validSizes.includes(size)) {
        throw new ValidationError(
            `Invalid image size. Must be one of: ${validSizes.join(', ')}`
        )
    }
}

export const validatePaginationParams = (
    page?: number,
    limit?: number
): void => {
    if (page !== undefined) {
        if (!Number.isInteger(page) || page < 1) {
            throw new ValidationError('Page must be a positive integer')
        }
    }

    if (limit !== undefined) {
        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            throw new ValidationError('Limit must be between 1 and 100')
        }
    }
}

// Sanitization utilities
export const sanitizePrompt = (prompt: string): string => {
    return prompt
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 1000) // Limit length
}

export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
}

// Form validation helpers
export const validateForm = <T extends Record<string, unknown>>(
    values: T,
    validators: Record<keyof T, (value: unknown) => string | null>
): Record<keyof T, string> => {
    const errors = {} as Record<keyof T, string>

    for (const [field, validator] of Object.entries(validators)) {
        const error = validator(values[field as keyof T])
        if (error) {
            errors[field as keyof T] = error
        }
    }

    return errors
}

// Common validators
export const validators = {
    required: (value: unknown): string | null => {
        if (value === null || value === undefined || value === '') {
            return 'This field is required'
        }
        return null
    },

    minLength:
        (min: number) =>
        (value: unknown): string | null => {
            if (typeof value === 'string' && value.length < min) {
                return `Must be at least ${min} characters long`
            }
            return null
        },

    maxLength:
        (max: number) =>
        (value: unknown): string | null => {
            if (typeof value === 'string' && value.length > max) {
                return `Must be less than ${max} characters long`
            }
            return null
        },

    email: (value: unknown): string | null => {
        if (typeof value === 'string' && value.length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address'
            }
        }
        return null
    },

    url: (value: unknown): string | null => {
        if (typeof value === 'string' && value.length > 0) {
            try {
                new URL(value)
                return null
            } catch {
                return 'Please enter a valid URL'
            }
        }
        return null
    },
}

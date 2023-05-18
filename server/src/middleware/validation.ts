import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'
import { ValidationError } from '../errors'
import { asyncHandler } from './errorHandler'

// Generic validation middleware
export const validate = (
  schema: Joi.ObjectSchema
): ReturnType<typeof asyncHandler> => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body, { abortEarly: false })

      if (error) {
        const errorMessages = error.details
          .map((detail) => detail.message)
          .join(', ')
        throw new ValidationError(`Validation failed: ${errorMessages}`)
      }

      next()
    }
  )
}

// Query validation middleware
export const validateQuery = (
  schema: Joi.ObjectSchema
): ReturnType<typeof asyncHandler> => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.query, { abortEarly: false })

      if (error) {
        const errorMessages = error.details
          .map((detail) => detail.message)
          .join(', ')
        throw new ValidationError(`Query validation failed: ${errorMessages}`)
      }

      next()
    }
  )
}

// Params validation middleware
export const validateParams = (
  schema: Joi.ObjectSchema
): ReturnType<typeof asyncHandler> => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.params, { abortEarly: false })

      if (error) {
        const errorMessages = error.details
          .map((detail) => detail.message)
          .join(', ')
        throw new ValidationError(
          `Parameter validation failed: ${errorMessages}`
        )
      }

      next()
    }
  )
}

// Common validation schemas
export const commonSchemas = {
  // Pagination schema
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(8),
  }),

  // MongoDB ObjectId schema
  objectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),

  // Image size schema
  imageSize: Joi.string().valid('Small', 'Medium', 'Large').default('Small'),
}

import Joi from 'joi'
import { commonSchemas } from '../middleware/validation'

// Image generation validation schema
export const generateImageSchema = Joi.object({
  prompt: Joi.string().trim().min(1).max(1000).required().messages({
    'string.empty': 'Prompt cannot be empty',
    'string.min': 'Prompt must be at least 1 character long',
    'string.max': 'Prompt cannot exceed 1000 characters',
    'any.required': 'Prompt is required',
  }),
  size: commonSchemas.imageSize,
})

// Get all images validation schema
export const getAllImagesSchema = commonSchemas.pagination.keys({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(8),
})

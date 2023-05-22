import { Router } from 'express'
import { fetchAllImages, generateImage } from '../controller/image.controller'
import { validate, validateQuery } from '../middleware/validation'
import {
  generateImageSchema,
  getAllImagesSchema,
} from '../validation/image.validation'

export const imageRouter = Router()

// GET /api/image/all - Get all images with pagination
imageRouter.get('/all', validateQuery(getAllImagesSchema), fetchAllImages)

// POST /api/image/generate - Generate a new image
imageRouter.post('/generate', validate(generateImageSchema), generateImage)

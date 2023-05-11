import { Request, Response } from 'express'
import { cloudinary, openai } from '../config/config'
import { createImage, findAllImages } from '../service/image.service'
import ResponseHandler from '../utils/responseHandler'
import { CreateImageRequestSizeEnum } from 'openai'
import { asyncHandler } from '../middleware/errorHandler'
import { ExternalServiceError, ValidationError } from '../errors'
import { logger } from '../utils/logger'

// Size mapping for OpenAI image generation
const sizeMapping = {
  Small: CreateImageRequestSizeEnum._256x256,
  Medium: CreateImageRequestSizeEnum._512x512,
  Large: CreateImageRequestSizeEnum._1024x1024,
} as const

type ImageSize = keyof typeof sizeMapping

export const fetchAllImages = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 8
    const skip = limit * (page - 1)

    logger.info('Fetching images', { page, limit, skip })

    const images = await findAllImages(limit, skip)

    const response = {
      images,
      pagination: {
        page,
        limit,
        total: images.length,
        hasMore: images.length === limit,
      },
    }

    ResponseHandler.success(res, response, 'Images retrieved successfully')
  }
)

export const generateImage = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { prompt, size } = req.body

    logger.info('Image generation request', {
      prompt: prompt?.substring(0, 50) + '...',
      size,
      ip: req.ip,
    })

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new ValidationError(
        'Prompt is required and must be a non-empty string'
      )
    }

    // Validate and map size
    const imageSize = sizeMapping[size as ImageSize] || sizeMapping.Small

    try {
      // Generate image using OpenAI
      logger.info('Calling OpenAI API for image generation')
      const aiResponse = await openai.createImage({
        prompt: prompt.trim(),
        n: 1,
        size: imageSize,
      })

      const imageUrl = aiResponse.data.data[0]?.url

      if (!imageUrl) {
        throw new ExternalServiceError(
          'OpenAI',
          'No image URL returned from OpenAI API'
        )
      }

      logger.info('Image generated successfully, uploading to Cloudinary')

      // Upload to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: 'ai-generated-images',
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      })

      // Ensure HTTPS URL
      const secureImageUrl = uploadedImage.url.replace(/^http:/, 'https:')

      logger.info('Image uploaded to Cloudinary successfully')

      // Save to database
      await createImage({
        imageUrl: secureImageUrl,
        prompt: prompt.trim(),
        cloudinaryId: uploadedImage.public_id,
      })

      logger.info('Image saved to database successfully')

      ResponseHandler.created(
        res,
        {
          imageUrl: secureImageUrl,
          cloudinaryId: uploadedImage.public_id,
        },
        'Image generated successfully'
      )
    } catch (error) {
      logger.error('Error in image generation:', error)

      // Handle specific OpenAI errors
      if (error instanceof Error && error.name === 'OpenAIError') {
        throw new ExternalServiceError('OpenAI', error.message)
      }

      // Handle Cloudinary errors
      if (error instanceof Error && error.message.includes('cloudinary')) {
        throw new ExternalServiceError('Cloudinary', error.message)
      }

      // Re-throw known errors
      if (
        error instanceof ValidationError ||
        error instanceof ExternalServiceError
      ) {
        throw error
      }

      // Handle unknown errors
      throw new ExternalServiceError(
        'Image Generation',
        'An unexpected error occurred during image generation'
      )
    }
  }
)

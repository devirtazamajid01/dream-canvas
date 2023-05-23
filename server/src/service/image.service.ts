import { ImageInput, ImageOutput } from '../types/Image'
import Image from '../models/image.schema'
import { DatabaseError, NotFoundError } from '../errors'
import { logger } from '../utils/logger'

export const createImage = async (input: ImageInput): Promise<ImageOutput> => {
  try {
    const { imageUrl, prompt, cloudinaryId } = input

    const newImage = new Image({
      imageUrl,
      prompt,
      cloudinaryId,
    })

    const savedImage = await newImage.save()

    logger.info('Image created successfully', {
      imageId: savedImage._id,
      prompt: prompt.substring(0, 50) + '...', // Log first 50 chars of prompt
      cloudinaryId,
    })

    return savedImage as ImageOutput
  } catch (error) {
    logger.error('Error creating image:', error)

    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        throw new DatabaseError(`Validation failed: ${error.message}`)
      }
      if (error.name === 'MongoError' && (error as any).code === 11000) {
        throw new DatabaseError('Image with this URL already exists')
      }
    }

    throw new DatabaseError('Failed to create image')
  }
}

export const findAllImages = async (
  limit: number,
  skip: number
): Promise<ImageOutput[]> => {
  try {
    const images = await Image.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec()

    logger.info('Images retrieved successfully', {
      count: images.length,
      limit,
      skip,
    })

    return images as ImageOutput[]
  } catch (error) {
    logger.error('Error retrieving images:', error)
    throw new DatabaseError('Failed to retrieve images')
  }
}

export const findImageById = async (id: string): Promise<ImageOutput> => {
  try {
    const image = await Image.findById(id).exec()

    if (!image) {
      throw new NotFoundError('Image not found')
    }

    logger.info('Image retrieved by ID', { imageId: id })

    return image as ImageOutput
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }

    logger.error('Error retrieving image by ID:', error)
    throw new DatabaseError('Failed to retrieve image')
  }
}

export const deleteImage = async (id: string): Promise<void> => {
  try {
    const result = await Image.findByIdAndDelete(id).exec()

    if (!result) {
      throw new NotFoundError('Image not found')
    }

    logger.info('Image deleted successfully', { imageId: id })
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }

    logger.error('Error deleting image:', error)
    throw new DatabaseError('Failed to delete image')
  }
}

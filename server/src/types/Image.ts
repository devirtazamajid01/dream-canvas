import { Document } from 'mongoose'

export interface ImageInput {
  prompt: string
  imageUrl: string
  cloudinaryId?: string
}

export interface ImageOutput extends Document {
  _id: string
  id: string
  imageUrl: string
  prompt: string
  cloudinaryId?: string
  createdAt: Date
  updatedAt: Date
}

export interface ImageResponse {
  id: string
  imageUrl: string
  prompt: string
  cloudinaryId?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedImagesResponse {
  images: ImageResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

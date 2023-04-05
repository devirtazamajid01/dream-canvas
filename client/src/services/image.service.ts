import axios, { isAxiosError } from '@/utils/axios'
import {
    ApiResponse,
    PaginatedResponse,
    Image,
    GenerateImageRequest,
} from '@/types/api'
import { withRetry, NetworkError, TimeoutError } from '@/utils/errorHandler'
import {
    validatePrompt,
    validateImageSize,
    validatePaginationParams,
} from '@/utils/validation'

const generateImage = async (
    data: GenerateImageRequest
): Promise<ApiResponse<Image>> => {
    // Validate input
    validatePrompt(data.prompt)
    validateImageSize(data.size)

    return withRetry(
        async () => {
            try {
                const response = await axios.post<ApiResponse<Image>>(
                    '/image/generate',
                    data
                )
                return response.data
            } catch (error: unknown) {
                if (isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        throw new TimeoutError(
                            'Image generation request timed out'
                        )
                    }
                    if (error.code === 'NETWORK_ERROR' || !error.response) {
                        throw new NetworkError(
                            'Network error occurred while generating image'
                        )
                    }

                    const errorMessage =
                        (error.response?.data as any)?.message ||
                        'Failed to generate image'
                    throw new Error(errorMessage)
                }
                throw error
            }
        },
        2,
        1000
    ) // Retry twice with 1 second delay
}

const fetchImages = async (
    page: number = 1,
    limit: number = 8
): Promise<PaginatedResponse<Image>> => {
    // Validate pagination parameters
    validatePaginationParams(page, limit)

    return withRetry(
        async () => {
            try {
                const response = await axios.get<PaginatedResponse<Image>>(
                    `/image/all?page=${page}&limit=${limit}`
                )
                return response.data
            } catch (error) {
                if (isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        throw new TimeoutError('Fetch images request timed out')
                    }
                    if (error.code === 'NETWORK_ERROR' || !error.response) {
                        throw new NetworkError(
                            'Network error occurred while fetching images'
                        )
                    }

                    const errorMessage =
                        (error.response?.data as any)?.message ||
                        'Failed to fetch images'
                    throw new Error(errorMessage)
                }
                throw error
            }
        },
        2,
        1000
    ) // Retry twice with 1 second delay
}

// Health check endpoint
const checkHealth = async (): Promise<ApiResponse<{ status: string }>> => {
    return withRetry(
        async () => {
            try {
                const response = await axios.get<
                    ApiResponse<{ status: string }>
                >('/health')
                return response.data
            } catch (error) {
                if (isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        throw new TimeoutError('Health check request timed out')
                    }
                    if (error.code === 'NETWORK_ERROR' || !error.response) {
                        throw new NetworkError(
                            'Network error occurred during health check'
                        )
                    }

                    const errorMessage =
                        (error.response?.data as any)?.message ||
                        'Health check failed'
                    throw new Error(errorMessage)
                }
                throw error
            }
        },
        1,
        500
    ) // Retry once with 500ms delay
}

const imageService = {
    generateImage,
    fetchImages,
    checkHealth,
}

export default imageService

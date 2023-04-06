// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean
    message: string
    data?: T
    code: number
    timestamp?: string
}

export interface PaginatedResponse<T = unknown> {
    success: boolean
    message: string
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
    code: number
    timestamp?: string
}

export interface ApiError {
    success: false
    message: string
    code: number
    timestamp: string
    path?: string
    method?: string
    stack?: string
    details?: unknown
}

// Request Types
export interface GenerateImageRequest {
    prompt: string
    size: 'Small' | 'Medium' | 'Large'
}

export interface FetchImagesRequest {
    page?: number
    limit?: number
}

// Image Types
export interface Image {
    _id: string
    id: string
    prompt: string
    imageUrl: string
    cloudinaryId?: string
    createdAt: string
    updatedAt: string
}

export interface ImageModalState {
    imgSrc: string | null
    open: boolean
    prompt: string
}

// Loading and Error States
export interface LoadingState {
    isLoading: boolean
    error: string | null
}

export interface AsyncState<T = unknown> extends LoadingState {
    data: T | null
}

// Form Validation
export interface ValidationError {
    field: string
    message: string
}

export interface FormState<T = Record<string, unknown>> {
    values: T
    errors: ValidationError[]
    isSubmitting: boolean
    isValid: boolean
}

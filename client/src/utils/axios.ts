import axiosLib, {
    AxiosResponse,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios'
import { ApiError } from '@/types/api'

// Environment configuration
const getBaseURL = (): string => {
    const baseURL = process.env['REACT_APP_API_HOST_URL']

    if (!baseURL) {
        console.warn(
            'REACT_APP_API_HOST_URL is not defined, using default localhost URL'
        )
        return 'http://localhost:5000'
    }

    return baseURL
}

// Create axios instance with enhanced configuration
const axios = axiosLib.create({
    baseURL: `${getBaseURL()}/api`,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // Set to true if you need to send cookies
})

// Request interceptor
axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add timestamp to prevent caching
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                _t: Date.now(),
            }
        }

        // Add request ID for tracking
        config.headers.set(
            'X-Request-ID',
            Math.random().toString(36).substring(7)
        )

        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
        })

        return config
    },
    (error: AxiosError) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor
axios.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log(
            `✅ ${response.config.method?.toUpperCase()} ${
                response.config.url
            }`,
            {
                status: response.status,
                data: response.data,
            }
        )

        // Check if the response indicates an error
        if (
            response.data &&
            typeof response.data === 'object' &&
            'success' in response.data
        ) {
            if (!response.data.success) {
                const apiError: ApiError = {
                    success: false,
                    message: response.data.message || 'API request failed',
                    code: response.data.code || response.status,
                    timestamp:
                        response.data.timestamp || new Date().toISOString(),
                    path: response.config.url || '',
                    method: response.config.method?.toUpperCase() || '',
                }
                return Promise.reject(apiError)
            }
        }

        return response
    },
    (error: AxiosError) => {
        console.error(
            `❌ ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
            {
                status: error.response?.status,
                message: error.message,
                data: error.response?.data,
            }
        )

        // Handle different types of errors
        if (error.response) {
            // Server responded with error status
            const apiError: ApiError = {
                success: false,
                message:
                    (error.response.data as any)?.message ||
                    error.message ||
                    'Server error occurred',
                code: error.response.status,
                timestamp: new Date().toISOString(),
                path: error.config?.url || '',
                method: error.config?.method?.toUpperCase() || '',
                details: error.response.data,
            }
            return Promise.reject(apiError)
        } else if (error.request) {
            // Network error
            const apiError: ApiError = {
                success: false,
                message: 'Network error - please check your connection',
                code: 0,
                timestamp: new Date().toISOString(),
                path: error.config?.url || '',
                method: error.config?.method?.toUpperCase() || '',
            }
            return Promise.reject(apiError)
        } else {
            // Request setup error
            const apiError: ApiError = {
                success: false,
                message: error.message || 'Request setup error',
                code: 500,
                timestamp: new Date().toISOString(),
            }
            return Promise.reject(apiError)
        }
    }
)

// Add type augmentation for axios
declare module 'axios' {
    interface AxiosError {
        isAxiosError: boolean
    }
}

// Helper function to check if error is axios error
const isAxiosError = (error: unknown): error is AxiosError => {
    return axiosLib.isAxiosError(error)
}

export default axios
export { isAxiosError }

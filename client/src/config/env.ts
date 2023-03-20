// Environment configuration with validation
interface EnvConfig {
    API_BASE_URL: string
    NODE_ENV: 'development' | 'production' | 'test'
    APP_NAME: string
    APP_VERSION: string
    ENABLE_ANALYTICS: boolean
    ENABLE_DEBUG: boolean
    MAX_IMAGE_SIZE: number
    REQUEST_TIMEOUT: number
}

const getEnvVar = (key: string, defaultValue?: string): string => {
    const value = import.meta.env[key] || defaultValue
    if (!value) {
        throw new Error(`Environment variable ${key} is required but not set`)
    }
    return value
}

const getBooleanEnvVar = (
    key: string,
    defaultValue: boolean = false
): boolean => {
    const value = import.meta.env[key]
    if (value === undefined) return defaultValue
    return value === 'true' || value === '1'
}

const getNumberEnvVar = (key: string, defaultValue: number): number => {
    const value = import.meta.env[key]
    if (value === undefined) return defaultValue
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
        console.warn(
            `Invalid number for environment variable ${key}: ${value}, using default: ${defaultValue}`
        )
        return defaultValue
    }
    return parsed
}

// Validate and create environment configuration
const createEnvConfig = (): EnvConfig => {
    const nodeEnv =
        (import.meta.env.MODE as EnvConfig['NODE_ENV']) || 'development'

    return {
        API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000'),
        NODE_ENV: nodeEnv,
        APP_NAME: getEnvVar('VITE_APP_NAME', 'AI Image Generator'),
        APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
        ENABLE_ANALYTICS: getBooleanEnvVar(
            'VITE_ENABLE_ANALYTICS',
            nodeEnv === 'production'
        ),
        ENABLE_DEBUG: getBooleanEnvVar(
            'VITE_ENABLE_DEBUG',
            nodeEnv === 'development'
        ),
        MAX_IMAGE_SIZE: getNumberEnvVar(
            'VITE_MAX_IMAGE_SIZE',
            10 * 1024 * 1024
        ), // 10MB
        REQUEST_TIMEOUT: getNumberEnvVar('VITE_REQUEST_TIMEOUT', 30000), // 30 seconds
    }
}

// Export the validated environment configuration
export const env = createEnvConfig()

// Type-safe environment variable access
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flags
export const features = {
    analytics: env.ENABLE_ANALYTICS,
    debug: env.ENABLE_DEBUG,
} as const

// Constants derived from environment
export const constants = {
    apiBaseUrl: env.API_BASE_URL,
    appName: env.APP_NAME,
    appVersion: env.APP_VERSION,
    maxImageSize: env.MAX_IMAGE_SIZE,
    requestTimeout: env.REQUEST_TIMEOUT,
} as const

// Development helpers
if (isDevelopment) {
    console.log('🔧 Environment Configuration:', {
        ...env,
        features,
        constants,
    })
}

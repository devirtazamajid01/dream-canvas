import EnvConfig from '../types/EnvConfig'
import Joi from 'joi'
import { config as cfg } from 'dotenv'
import path from 'path'
import { Configuration, OpenAIApi } from 'openai'
import { v2 as cloudinarySetup } from 'cloudinary'
import { logger } from '../utils/logger'

// Load environment variables
cfg({ path: path.join(__dirname, '../../.env') })

// Environment validation schema
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    PORT: Joi.number().default(8080),
    MONGODB_URL: Joi.string().required().uri().messages({
      'any.required': 'MONGODB_URL is required',
      'string.uri': 'MONGODB_URL must be a valid URI',
    }),
    OPEN_AI_KEY: Joi.string().required().min(1).messages({
      'any.required': 'OPEN_AI_KEY is required',
      'string.min': 'OPEN_AI_KEY cannot be empty',
    }),
    CLOUDINARY_CLOUD_NAME: Joi.string().required().min(1).messages({
      'any.required': 'CLOUDINARY_CLOUD_NAME is required',
      'string.min': 'CLOUDINARY_CLOUD_NAME cannot be empty',
    }),
    CLOUDINARY_API_KEY: Joi.string().required().min(1).messages({
      'any.required': 'CLOUDINARY_API_KEY is required',
      'string.min': 'CLOUDINARY_API_KEY cannot be empty',
    }),
    CLOUDINARY_API_SECRET: Joi.string().required().min(1).messages({
      'any.required': 'CLOUDINARY_API_SECRET is required',
      'string.min': 'CLOUDINARY_API_SECRET cannot be empty',
    }),
    ALLOWED_ORIGINS: Joi.string()
      .default('http://localhost:3000')
      .description('Comma-separated list of allowed CORS origins'),
    RATE_LIMIT_WINDOW_MS: Joi.number()
      .default(900000) // 15 minutes
      .description('Rate limit window in milliseconds'),
    RATE_LIMIT_MAX_REQUESTS: Joi.number()
      .default(100)
      .description('Maximum requests per window'),
    IMAGE_GENERATION_RATE_LIMIT_WINDOW_MS: Joi.number()
      .default(60000) // 1 minute
      .description('Image generation rate limit window in milliseconds'),
    IMAGE_GENERATION_RATE_LIMIT_MAX_REQUESTS: Joi.number()
      .default(5)
      .description('Maximum image generation requests per window'),
  })
  .unknown()

// Validate environment variables
const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  const errorMessage = `Environment validation failed: ${error.details
    .map((d) => d.message)
    .join(', ')}`
  logger.error(errorMessage)
  throw new Error(errorMessage)
}

// Export validated configuration
export const config: EnvConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  databaseUrl: envVars.MONGODB_URL,
  openAiKey: envVars.OPEN_AI_KEY,
  cloudinary: {
    name: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
  cors: {
    allowedOrigins: envVars.ALLOWED_ORIGINS.split(',').map((origin: string) =>
      origin.trim()
    ),
  },
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    maxRequests: envVars.RATE_LIMIT_MAX_REQUESTS,
    imageGenerationWindowMs: envVars.IMAGE_GENERATION_RATE_LIMIT_WINDOW_MS,
    imageGenerationMaxRequests:
      envVars.IMAGE_GENERATION_RATE_LIMIT_MAX_REQUESTS,
  },
}

// Environment validation function
export const validateEnv = (): void => {
  const { error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env)

  if (error) {
    const errorMessage = `Environment validation failed: ${error.details
      .map((d) => d.message)
      .join(', ')}`
    logger.error(errorMessage)
    throw new Error(errorMessage)
  }

  logger.info('Environment variables validated successfully')
}

// Open AI Setup

const configuration = new Configuration({
  apiKey: config.openAiKey,
})

export const openai = new OpenAIApi(configuration)

// Cloudinary Setup

cloudinarySetup.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
})

export const cloudinary = cloudinarySetup

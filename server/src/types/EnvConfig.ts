interface EnvConfig {
  env: string
  port: number
  databaseUrl: string
  openAiKey: string
  cloudinary: {
    name: string
    apiKey: string
    apiSecret: string
  }
  cors: {
    allowedOrigins: string[]
  }
  rateLimit: {
    windowMs: number
    maxRequests: number
    imageGenerationWindowMs: number
    imageGenerationMaxRequests: number
  }
}

export default EnvConfig

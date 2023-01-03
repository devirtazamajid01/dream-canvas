# Dream Canvas – AI Image Generator

Modern, full‑stack AI image generator with a React + Vite client and a secure Node/Express + MongoDB server. Uses OpenAI for image generation and Cloudinary for image hosting.

## ✨ Features

- TypeScript across client and server
- Robust error handling and logging
- Client‑side validation and sanitization
- Axios with interceptors, retry utilities
- Theming (light/dark/system), accessibility, and performance optimizations
- MongoDB with Mongoose, graceful shutdown, indexes
- Cloudinary image upload; HTTPS image URLs

## 🗂️ Monorepo Structure

```
ai-image-generator/
├── client/        # React + Vite app
└── server/        # Express + TypeScript API
```

## 🚀 Quick Start (npm)

```bash
# 1) Install all deps
npm install

# 2) Start dev servers
npm run dev:client   # client on http://localhost:3000
npm run dev:server   # server on http://localhost:5000 (configurable)

# 3) Build
npm run build        # builds client then server

# 4) Clean artifacts
npm run clean        # removes client/dist and server/build
```

## 🔧 Environment Setup

Create `server/.env`:

```env
NODE_ENV=development
PORT=8080
MONGODB_URL=mongodb://localhost:27017/dream-canvas
OPEN_AI_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ALLOWED_ORIGINS=http://localhost:3000
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Dream Canvas
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
VITE_MAX_IMAGE_SIZE=10485760
VITE_REQUEST_TIMEOUT=30000
```

## 🧩 API

- GET `/health` – server health
- POST `/api/image/generate` – `{ prompt: string, size: "Small" | "Medium" | "Large" }`
- GET `/api/image/all?page=1&limit=8` – paginated images

Responses follow:

```json
{ "success": true, "message": "...", "code": 200, "data": {} }
```

## 🛡️ Security & Best Practices

- Helmet, CORS, rate limiting (general + image generation)
- Centralized error handling with structured responses
- Validation via Joi (server) and utilities (client)
- Winston logging (console + files)

## 📦 Deployment

```bash
npm run build
cd server
node build/app.js
```

Deploy `client/dist` to any static host (Vercel/Netlify/etc.). Set `VITE_API_BASE_URL` to your server URL.

## 🤝 Contributing

1. Fork the repo and create a feature branch
2. Commit with clear messages
3. Open a PR with context

## 📄 License
MIT

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        define: {
            'process.env.REACT_APP_API_HOST_URL': JSON.stringify(
                env.REACT_APP_API_HOST_URL
            ),
        },
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@/components': path.resolve(__dirname, './src/components'),
                '@/utils': path.resolve(__dirname, './src/utils'),
                '@/types': path.resolve(__dirname, './src/types'),
                '@/services': path.resolve(__dirname, './src/services'),
                '@/contexts': path.resolve(__dirname, './src/contexts'),
                '@/assets': path.resolve(__dirname, './src/assets'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom'],
                        router: ['react-router-dom'],
                        ui: ['daisyui'],
                    },
                },
            },
            sourcemap: mode === 'development',
        },
        server: {
            port: 3000,
            open: true,
        },
    }
})

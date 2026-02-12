import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
            proxy: {
                // redirige toutes les requêtes /api vers ton serveur PHP
                '/API': {
                    target: 'http://localhost/appEASUP/API', // chemin vers ton serveur PHP
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/API/, '')
                }
            }
        },
        plugins: [react()],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});

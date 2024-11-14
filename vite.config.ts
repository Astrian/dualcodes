import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: { enabled: true },
      injectRegister: 'auto',
			manifest: {
        name: 'DualCodes',
        short_name: 'DualCodes',
        description: '2FA code manager right in your browser',
        theme_color: '#0284c7',
        icons: [{
          src: 'appicon@192.png',
          sizes: '192x192',
          type: 'image/png'
        }, {
          src: 'appicon@512.png',
          sizes: '512x512',
          type: 'image/png'
        }, {
          src: 'appicon-mask@512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }, {
          src: 'appicon-mask@192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        }, {
          src: 'appicon@192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        }]
      },
			workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        runtimeCaching: [{
          urlPattern: ({request}) => request.url.includes('/api'),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }]
      }
		})
	],
	server: {
		port: 5173,
		open: true,
		proxy: {
			"/api": {
				target: "http://127.0.0.1:3000",
				changeOrigin: true,
			},
		},
	}
})

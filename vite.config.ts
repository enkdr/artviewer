import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Cache static assets built into the app (e.g., icons, assets)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        // Runtime caching for dynamic images (e.g., fetched over the network)
        runtimeCaching: [
          {
            // Match all image requests
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst', // Use cached image first, fall back to network
            options: {
              cacheName: 'image-cache', // Custom cache name
              expiration: {
                maxEntries: 100, // Keep max 100 images
                maxAgeSeconds: 60 * 60 * 24 * 30, // Keep images for 30 days
              },
              cacheableResponse: {
                statuses: [0, 200], // Cache opaque (CORS) and successful responses
              },
            },
          },
          {
            // Optional: Cache API responses (if images are served via API)
            urlPattern: /.*\/api\/.*\.(png|jpg|jpeg|webp|svg)$/,
            handler: 'NetworkFirst', // Try network first, fallback to cache
            options: {
              cacheName: 'api-image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'ArtViewer',
        short_name: 'ArtViewer',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'src/assets/image/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'src/assets/image/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable service worker during development (optional, for testing)
        type: 'module',
      },
    }),
  ],
});

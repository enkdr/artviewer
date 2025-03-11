import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
      },
      manifest: {
        name: 'ArtViewer',
        short_name: 'ArtViewer',
        theme_color: '#ffffff',
        icons: [
          { src: 'assets/image/favicon.png', sizes: '512x512', type: 'image/png' },
          { src: 'assets/image/favicon.png', sizes: '192x192', type: 'image/png' },
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})

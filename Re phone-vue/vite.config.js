import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Re phone',
        short_name: 'RePhone',
        theme_color: '#000000',
        icons: [
          {
            src: 'https://raw.githubusercontent.com/1687216166Pat/photo/main/heart.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // 这里的配置确保 Service Worker 能够处理基础的缓存
        runtimeCaching: [],
      },
    }),
  ],
})

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
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
      // 开启后台运行支持
      workbox: {
        runtimeCaching: [],
      },
    }),
  ],
})

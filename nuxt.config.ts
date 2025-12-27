// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    server: {
      watch: {
        usePolling: true,   // 強制每隔一段時間檢查檔案有沒有變
        interval: 1000,     // (選用) 每 1 秒檢查一次，避免 CPU 飆高
      }
    }
  },
  modules: ['@nuxtjs/tailwindcss'],
  // ✨ 新增這一段：讓 Pyodide 在全站都會預先載入
  app: {
    head: {
      script: [
        {
          src: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js",
          defer: true // 加上 defer 讓它不會卡住畫面顯示
        }
      ]
    }
  }
})
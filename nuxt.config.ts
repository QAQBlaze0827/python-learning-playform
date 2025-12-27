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
  modules: ['@nuxtjs/tailwindcss']
})
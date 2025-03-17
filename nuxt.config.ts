// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-gtag'],
  app: {
    head: {
      title: 'Jason Bunnell',
      link: [
        { 
          rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
          
        }
      ]
    }
  },
  gtag: {
    id: 'G-SYKLL9LJWB'
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  }
})
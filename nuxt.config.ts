// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)
export default defineNuxtConfig({
  app: {
    head: {
      title: 'AI-Voice-Download',
      meta: [
        {
          name: 'description',
          content: 'AI-Voice-Download,ChatGPT API Voice Download.'
        },
        {
          name: 'keywords',
          content: 'AI,AI-Voice,AI Voice Down,ChatGPT voice download.'
        }
      ]
    }
  },
  alias: {
    // '@': resolve(__dirname, '/'),
    assets: '/<rootDir>/assets'
  },
  modules: [],
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  ssr: false
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  modules: ["@nuxt/ui", "@nuxt/image"],
  imports: { autoImport: true, dirs: ["node_modules"], global: false },
  typescript: {
    tsConfig: { include: ["node_modules"] }
  },
  build: {
    transpile: ["muuri"],
  },
  image: {

  },
  logLevel: 'info'
})
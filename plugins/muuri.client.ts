import Muuri from 'muuri'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: { muuri: Muuri }
  }


})
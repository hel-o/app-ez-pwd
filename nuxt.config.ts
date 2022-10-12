// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    ssr: false,
    css: [
        '@/assets/css/base.css'
    ],
    vite: {
        // https://github.com/nuxt/framework/discussions/1223#discussioncomment-2943683
        server: {
            proxy: {
                '/api/v1': {
                    target: 'http://localhost:5000',
                    changeOrigin: true
                }
            }
        }
    }
})

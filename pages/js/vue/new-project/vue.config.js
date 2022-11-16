/*
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ]
})
*/

module.exports = {

    productionSourceMap: false,

    css: {
        extract: false
    },

    devServer: {
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/': {
                target: 'https://redcap.test/API_PROXY/index.php',
                ws: false,
                changeOrigin: true,
                pathRewrite: {'^/': ''}
            },
        },
    },

    publicPath: "" ,

    transpileDependencies: [
        'vuetify'
    ]
}

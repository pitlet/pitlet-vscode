
// const { transformCss } = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('@pitlet/transform-js-module')
const {
  transformVue,
  transformVuePostTransformBlock,
  transformVueStyle,
  transformVueTemplate,
} = require('@pitlet/transform-vue')
const path = require('path')

const transformFunctionMap = {
  vue: [transformVue, transformJsModule],
  'vue-html': [transformVueTemplate, transformJsModule],
  'vue-js': [transformJsModule, transformVuePostTransformBlock],
  // 'vue-css': [transformCss, transformVueStyle, transformVuePostTransformBlock],
  js: [transformJsModule],
  // css: [transformCss],
}

module.exports = {
  transformFunctionMap,
  alias: {
    vue: path.join(__dirname, 'web_modules', 'vue.js')
  }
}
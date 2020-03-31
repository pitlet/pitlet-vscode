const {
  transformCss,
} = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')
const {
  transformReact,
} = require('../../../../../bundler3/packages/transform/transform-react/dist/transformReact')
const {
  transformSvelte,
} = require('../../../../../bundler3/packages/transform/transform-svelte/dist/transformSvelte')

const path = require('path')

const transformFunctionMap = {
  svelte: [transformSvelte, transformJsModule],
  js: [transformReact, transformJsModule],
  css: [transformCss],
}

module.exports = {
  transformFunctionMap,
  alias: {
    svelte: path.join(__dirname, 'web_modules', 'svelte.js'),
  },
}

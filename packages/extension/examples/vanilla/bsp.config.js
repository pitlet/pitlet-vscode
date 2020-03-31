const {
  transformCss,
} = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')

const transformFunctionMap = {
  js: [transformJsModule],
  css: [transformCss],
}

module.exports = {
  transformFunctionMap,
}

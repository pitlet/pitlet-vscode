const {
  transformCss,
} = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')
const {
  transformPreact,
} = require('../../../../../bundler3/packages/transform/transform-preact/dist/transformPreact')
const path = require('path')

const transformFunctionMap = {
  js: [transformPreact, transformJsModule],
  css: [transformCss],
}

module.exports = {
  transformFunctionMap,
  alias: {
    preact: path.join(__dirname, 'web_modules', 'preact.js'),
  },
}

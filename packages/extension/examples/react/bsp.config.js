
const { transformCss } = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')
const {
  transformReact
} = require('../../../../../bundler3/packages/transform/transform-react/dist/transformReact')
const path = require('path')

const transformFunctionMap = {
  js: [transformReact, transformJsModule],
  css: [transformCss],
}

module.exports = {
  transformFunctionMap,
  alias: {
    react: path.join(__dirname, 'web_modules', 'react.js'),
    'react-dom': path.join(__dirname, 'web_modules', 'react-dom.js')
  }
}
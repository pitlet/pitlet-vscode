// const { transformCss } = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const { transformJsModule } = require('@pitlet/transform-js-module')
const { transformReact } = require('@pitlet/transform-react')
const path = require('path')

const transformFunctionMap = {
  js: [transformReact, transformJsModule],
  // css: [transformCss],
}

module.exports = {
  transformFunctionMap,
  // need to use esm versions of react and react-dom since pitlet doesn't support commonjs yet
  alias: {
    react: path.join(__dirname, 'web_modules', 'react.js'),
    'react-dom': path.join(__dirname, 'web_modules', 'react-dom.js'),
  },
}

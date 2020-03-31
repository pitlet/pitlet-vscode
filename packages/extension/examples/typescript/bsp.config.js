const {
  transformCss,
} = require('../../../../../bundler3/packages/transform/transform-css/dist/transformCss')
const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')
const {
  transformTsWithBabel,
} = require('../../../../../bundler3/packages/transform/transform-ts-with-babel/dist/transformTsWithBabel')
const path = require('path')

const transformFunctionMap = {
  ts: [transformTsWithBabel, transformJsModule],
  js: [transformJsModule],
  css: [transformCss],
}

const entryPath = path.join(__dirname, 'src', 'index.ts')

module.exports = {
  transformFunctionMap,
  entryPath,
}

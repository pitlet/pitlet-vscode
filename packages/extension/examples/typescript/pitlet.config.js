
const {
  transformJsModule, } = require('@pitlet/transform-js-module')
const {
  transformTsWithBabel,
} = require('@pitlet/transform-ts-with-babel')
const path = require('path')

const transformFunctionMap = {
  ts: [transformTsWithBabel, transformJsModule],
  js: [transformJsModule],
}


module.exports = {
  transformFunctionMap,
  entryPath: path.join(__dirname, 'src', 'index.ts'),
}


const {
  transformJsModule,
} = require('../../../../../bundler3/packages/transform/transform-js-module/dist/transformJsModule')

const transformFunctionMap = {
  js: [transformJsModule],
}

module.exports = {
  transformFunctionMap,
}

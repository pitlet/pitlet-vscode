// import { createTransform, collectAssets, nodeBundler } from '@pitlet/core'
// import { packageJs } from '@pitlet/package-js'
// import { measureStart, measureEnd } from './measure'
// import * as fs from 'fs'

// const originalResolve = nodeBundler.resolve

// export const bundle = async ({
//   workspaceFolder,
// }: {
//   workspaceFolder: string
// }) => {
//   const configPath = workspaceFolder + '/pitlet.config.js'
//   if (!fs.existsSync(configPath)) {
//     return
//   }
//   measureStart('require config')
//   const config = await eval('require')(configPath)
//   measureEnd('require config')
//   measureStart('bundling')
//   const { transformFunctionMap, alias, entryPath } = config
//   const transform = createTransform({ transformFunctionMap })
//   const entry = {
//     protocol: 'filesystem',
//     meta: {
//       id: entryPath || `${workspaceFolder}/src/index.js`,
//     },
//   }
//   nodeBundler.resolve = (importee, importer) => {
//     if (alias && importee in alias) {
//       return alias[importee]
//     }
//     return originalResolve(importee, importer)
//   }
//   measureStart('collect assets')
//   const assets = await collectAssets({
//     bundler: nodeBundler,
//     transform,
//     entry,
//   })
//   measureEnd('collect assets')
//   const operations = await packageJs(assets, workspaceFolder, entry.meta.id)

//   measureEnd('bundling')
//   measureStart('writing to disk')
//   const distFolder = `${workspaceFolder}/dist`
//   if (!fs.existsSync(distFolder)) {
//     fs.mkdirSync(distFolder)
//   }

//   operations.push({
//     type: 'write',
//     destinationPath: 'index.html',
//     content: `<!DOCTYPE html>
// <html>
// <head>
// </head>
// <body>
// <div id="app"></div>
// <script type="module" src="main.js"></script>
// </body>
// </html>`,
//   })
//   for (const operation of operations) {
//     switch (operation.type) {
//       case 'write':
//         fs.writeFileSync(
//           `${distFolder}/${operation.destinationPath}`,
//           operation.content,
//         )
//         break
//       default:
//         break
//     }
//   }
//   measureEnd('writing to disk')
//   return {
//     transform,
//     resolve: nodeBundler.resolve,
//   }
// }

// export const createAsset = () => {}
// export const readAsset = () => {}
// export const updateAsset = () => {}
// export const deleteAsset = () => {}

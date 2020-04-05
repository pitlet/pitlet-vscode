//  if (newAssets.length === 1) {
//       const newAsset = await transform(newAssets[0])
//       const oldAsset = assets.find(
//         (asset: any) => asset.meta.id === newAsset.meta.id,
//       )
//       if (
//         oldAsset.protocol === 'virtual' &&
//         newAsset.protocol === 'virtual' &&
//         oldAsset.content === newAsset.content
//       ) {
//         const deleted = []
//         const added = []
//         const oldDependencies = oldAsset.meta.directDependencies
//         const newDependencies = newAsset.meta.directDependencies
//         const minLength = Math.min(
//           oldDependencies.length,
//           newDependencies.length,
//         )
//         const oldStringifiedDependencies = oldDependencies.map(JSON.stringify)
//         const newStringifiedDependencies = newDependencies.map(JSON.stringify)
//         for (let i = 0; i < minLength; i++) {
//           if (
//             !newStringifiedDependencies.includes(
//               oldStringifiedDependencies[i],
//             )
//           ) {
//             deleted.push(oldDependencies[i])
//           }
//           if (
//             !oldStringifiedDependencies.includes(
//               newStringifiedDependencies[i],
//             )
//           ) {
//             const transformed = await transform(newDependencies[i])
//             console.log('TTT')
//             console.log(JSON.stringify(transformed, null, 2))
//             added.push(transformed)
//           }
//         }
//         for (let i = minLength; i < oldStringifiedDependencies.length; i++) {
//           if (
//             !newStringifiedDependencies.includes(
//               oldStringifiedDependencies[i],
//             )
//           ) {
//             deleted.push(oldDependencies[i])
//           }
//         }
//         for (let i = minLength; i < newStringifiedDependencies.length; i++) {
//           if (
//             !oldStringifiedDependencies.includes(
//               newStringifiedDependencies[i],
//             )
//           ) {
//             const transformed = await transform(newDependencies[i])

//             added.push(transformed)
//           }
//         }
//         console.log('ADDED')
//         console.log(JSON.stringify(added, null, 2))
//         console.log('DELETED')
//         console.log(JSON.stringify(deleted, null, 2))
//         const withDependencyMap = added.map(dependency => {
//           const { content, sourceMap, id } = dependency
//           return {
//             content,
//             sourceMap,
//             id,
//             dependencyMap: {
//               vue:
//                 '/home/simon/Documents/from-github/config-live-extension/packages/extension/examples/vue/web_modules/vue.js',
//             },
//           }
//         })
//         console.log('basically equal')
//         const message = {
//           commands: [
//             ...deleted.map(dependency => ({
//               command: 'DELETE',
//               payload: {
//                 id: dependency.meta.id,
//               },
//             })),
//             ...withDependencyMap.map(dependency => ({
//               command: 'ADD',
//               payload: dependency,
//             })),
//           ],
//         }
//         const stringifiedMessage = JSON.stringify(message, null, 2)
//         console.log(stringifiedMessage)
//         for (const webSocket of webSockets) {
//           webSocket.send(stringifiedMessage)
//         }
//         return
//       }
//       throw new Error('should not happen')
//     }
//     throw new Error('should not happen')

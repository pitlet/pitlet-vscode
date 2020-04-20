// import * as http from 'http'
// import * as serveStatic from 'serve-static'
// import * as WebSocket from 'ws'
// import { bundle } from './bundle'
// import { FileWatcherEvent, getHmrUpdates } from './updateAssets'
// import { performance } from 'perf_hooks'

// export const createDevServer = async ({
//   workspaceFolder,
// }: {
//   workspaceFolder: string
// }) => {
//   console.log('b1')
//   await new Promise(resolve => {
//     setTimeout(resolve, 800)
//   })
//   console.log('before make request')
//   const endTime = process.hrtime()
//   const request = http.request(
//     {
//       hostname: 'localhost',
//       port: 3000,
//       path: '/kill-me',
//       method: 'GET',
//     },
//     response => {
//       let body = ''
//       response.on('data', chunk => {
//         body += chunk
//       })
//       response.on('end', () => {
//         const data = JSON.parse(body)
//         const { startTime } = data
//         const difference =
//           endTime[0] * 1000 -
//           startTime[0] * 1000 +
//           (endTime[1] / 1000000 - startTime[1] / 1000000)
//         console.log(`difference ${Math.round(difference)}ms`)
//         // console.log('Got a response: ' + JSON.stringify(data))
//       })
//     },
//   )
//   await new Promise(resolve => request.end(resolve))
//   const server = http.createServer((request, response) => {
//     if (request.url === '/status.json') {
//       response.writeHead(200, { 'Content-Type': 'application/json' })
//       response.write('{ "status": "bundled" }')
//       response.end()
//     } else {
//       response.writeHead(200, { 'Content-Type': 'text/html' })
//       response.write('bundling finished')
//       response.end()
//     }
//   })
//   await new Promise(resolve => server.listen(3000, resolve))
//   // const now = process.hrtime()
//   // const microseconds = now[0] * 1000000 + now[1] / 1000
//   // const server = http.createServer((request, response) => {
//   //   response.writeHead(200, { 'Content-Type': 'text/html' })
//   //   response.write(`<h1>Bundling in progress...${microseconds}</h1>`)
//   //   response.end()
//   // })
//   // await new Promise(resolve => server.listen(3000, () => resolve()))
//   // await bundle({ workspaceFolder })
//   // const serve = serveStatic(distFolder)
//   // const webSocketServer = new WebSocket.Server({ server })
//   // webSocketServer.on('connection', webSocket => {
//   //   console.log('opened websocket')
//   //   webSocket.on('open', () => {})
//   // })

//   return {
//     update: async (fileWatcherEvents: readonly FileWatcherEvent[]) => {
//       // const updates = await getHmrUpdates(
//       //   assets,
//       //   fileWatcherEvents,
//       //   transform,
//       //   resolve,
//       // )
//       // if (updates.length > 0) {
//       //   const message = JSON.stringify(updates)
//       //   for (const webSocket of webSocketServer.clients) {
//       //     webSocket.send(message)
//       //   }
//       // }
//     },
//   }
// }

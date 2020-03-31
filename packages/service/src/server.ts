import * as http from 'http'
import * as WebSocket from 'ws'
import { createTransform, collectAssets, nodeBundler } from '@pitlet/core'
import { packageJs } from '@pitlet/package-js'
import * as fs from 'fs'
import * as serveStatic from 'serve-static'

const html = `<!DOCTYPE html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <script>
  const webSocket = new WebSocket('ws://localhost:3000')
  webSocket.onmessage = ({data})=>{
    const {command, payload} = JSON.parse(data)
    switch (command) {
      case 'eval':
        eval(payload)
        break;
      default:
        break;
    }
  }
  console.log(webSocket)
  </script>
</body>
`

const originalResolve = nodeBundler.resolve

export const createDevServer = async ({
  workspaceFolder,
}: {
  workspaceFolder: string
}) => {
  const config = await require(workspaceFolder + '/bsp.config.js')
  const { transformFunctionMap, alias, entryPath } = config
  const transform = createTransform({ transformFunctionMap })
  const entry = {
    protocol: 'filesystem',
    meta: {
      id: entryPath || `${workspaceFolder}/src/index.js`,
    },
  }
  nodeBundler.resolve = (importee, importer) => {
    if (importee in alias) {
      return alias[importee]
    }
    return originalResolve(importee, importer)
  }
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform,
    entry,
  })
  const operations = await packageJs(assets, workspaceFolder, entry.meta.id)

  const distFolder = `${workspaceFolder}/dist`
  if (!fs.existsSync(distFolder)) {
    fs.mkdirSync(distFolder)
  }

  operations.push({
    type: 'write',
    destinationPath: 'index.html',
    content: `<!DOCTYPE html>
<html>
<head>
</head>
<body>
<div id="app"></div>
<script type="module" src="main.js"></script>
</body>
</html>`,
  })
  for (const operation of operations) {
    switch (operation.type) {
      case 'write':
        fs.writeFileSync(
          `${distFolder}/${operation.destinationPath}`,
          operation.content,
        )
        break
      default:
        break
    }
  }
  const serve = serveStatic(distFolder)
  const server = http.createServer((request, response) => {
    // @ts-ignore
    serve(request, response, () => {
      console.log('next')
    })
    // const indexHtml = fs.createReadStream(`${distFolder}/index.html`)
    // response.writeHead(200, { 'Content-Type': 'text/html' })
    // indexHtml.pipe(response, { end: true })
  })
  const webSocketServer = new WebSocket.Server({ server })
  const webSockets = new Set<WebSocket>()
  webSocketServer.on('connection', webSocket => {
    webSockets.add(webSocket)
    console.log('opened websocket')
    webSocket.on('open', () => {})
  })

  return {
    listen: (port: number) =>
      new Promise<void>(resolve => server.listen(port, resolve)),
    update: async (assets: any[]) => {
      console.log('update')
      const transformedAssets = await Promise.all(assets.map(transform))
      const transformedDependencies = (
        await Promise.all(
          transformedAssets.map(transformed =>
            Promise.all(
              transformed.meta.directDependencies
                .filter(
                  (directDependency: any) =>
                    directDependency.protocol === 'virtual',
                )
                .map(transform),
            ),
          ),
        )
      ).flat()
      console.log(JSON.stringify(transformedDependencies, null, 2))
      const message = JSON.stringify({
        command: 'update',
        payload: {
          transformedAssets: [...transformedAssets, ...transformedDependencies],
        },
      })
      for (const webSocket of webSockets) {
        webSocket.send(message)
      }
    },
  }
}

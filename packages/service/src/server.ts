import * as http from 'http'
import * as WebSocket from 'ws'
import { createTransform, collectAssets, nodeBundler } from '@pitlet/core'
// import { packageJs } from '@pitlet/package-js'
import { packageJs } from '../../../../bundler3/packages/package/package-js/dist/packageJs'
import * as fs from 'fs'
import * as serveStatic from 'serve-static'
import { measureStart, measureEnd } from './measure'
import { getHmrUpdates, FileWatcherEvent } from './updateAssets'

const html = `<!DOCTYPE html>
<head>
  <meta charset="utf-8">
</head>
<body>

</body>
`

const originalResolve = nodeBundler.resolve

export const createDevServer = async ({
  workspaceFolder,
}: {
  workspaceFolder: string
}) => {
  const configPath = workspaceFolder + '/pitlet.config.js'
  if (!fs.existsSync(configPath)) {
    return
  }
  measureStart('require config')
  const config = await eval('require')(configPath)
  measureEnd('require config')
  measureStart('bundling')
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
  measureStart('collect assets')
  const assets = await collectAssets({
    bundler: nodeBundler,
    transform,
    entry,
  })
  measureEnd('collect assets')
  const operations = await packageJs(assets, workspaceFolder, entry.meta.id)

  measureEnd('bundling')
  measureStart('writing to disk')
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
  measureEnd('writing to disk')
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
  webSocketServer.on('connection', webSocket => {
    console.log('opened websocket')
    webSocket.on('open', () => {})
  })

  return {
    listen: (port: number) =>
      new Promise<void>(resolve => server.listen(port, resolve)),
    update: async (fileWatcherEvents: readonly FileWatcherEvent[]) => {
      const updates = await getHmrUpdates(assets, fileWatcherEvents, transform)
      const message = JSON.stringify(updates)
      for (const webSocket of webSocketServer.clients) {
        webSocket.send(message)
      }
    },
  }
}

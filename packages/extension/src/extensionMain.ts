import 'source-map-support/register'
import * as vscode from 'vscode'
import { localPluginFormatting } from './local-plugins/local-plugin-formatting/localPluginExt'
import type { LocalPlugin } from './local-plugins/pluginApi'

export const activate: (
  context: vscode.ExtensionContext
) => Promise<void> = async (context) => {
  // let startTime = [-1, -1]
  // const server = http.createServer(async (request, response) => {
  //   if (request.url === '/') {
  //     response.writeHead(200, { 'Content-Type': 'text/html' })
  //     response.write(html)
  //     response.end()
  //   } else if (request.url === '/status.json') {
  //     response.writeHead(200, { 'Content-Type': 'application/json' })
  //     response.write('{ "status": "bundling" }')
  //     response.end()
  //   } else if (request.url === '/kill-me') {
  //     response.end(JSON.stringify({ startTime }))
  //     server.close()
  //   }
  // })
  // await new Promise(resolve => server.listen(3000, resolve))
  // startTime = process.hrtime()
  const LOCAL_PLUGINS: LocalPlugin[] = [localPluginFormatting]
  await Promise.all(LOCAL_PLUGINS.map((localPlugin) => localPlugin(context)))
}

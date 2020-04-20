import 'source-map-support/register'
import * as vscode from 'vscode'
import { localPluginFormatting } from './local-plugins/local-plugin-formatting/localPluginExt'
import type { LocalPlugin } from './local-plugins/pluginApi'
import * as http from 'http'

const html = `<DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body>
  <h1>Bundling in progress...</h1>
  <script>
    const refresh = async () => {
      try{
        const {status} = await fetch('./status.json').then(response => response.json())
        if(status === 'bundling'){
          setTimeout(refresh, 1000)
        } else if (status === 'bundled'){
          window.location.reload(true)
        }
      } catch(error){
        console.log('failed')
        console.error(error)
      }
    }
    refresh()
  </script>
</body>
</html>
`
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

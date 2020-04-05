import {
  createConnection,
  TextDocumentSyncKind,
  ServerRequestHandler,
  RequestType,
  NotificationType,
} from 'vscode-languageserver'
import { documents } from './documents'
import {
  enableBetterErrorHandlingAndLogging,
  handleError,
} from './errorHandlingAndLogging'
import { createDevServer } from 'service'
import { FileWatcherEvent } from 'service/src/updateAssets'
const connection = createConnection()

enableBetterErrorHandlingAndLogging(connection)

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
  },
}))

const getType = (id: string) => {
  if (id.endsWith('.js')) {
    return 'js'
  }
  if (id.endsWith('.vue')) {
    return 'vue'
  }
}

connection.onInitialized(async () => {
  console.log('initialized')
  const workspaceFolders = await connection.workspace.getWorkspaceFolders()
  const workspaceFolder = workspaceFolders![0].uri.slice(7)
  console.log(workspaceFolder)
  const devServer = await createDevServer({ workspaceFolder })
  if (!devServer) {
    return
  }
  await devServer.listen(3000)
  // connection.window.showInformationMessage(
  //   'Sever started on http://localhost:3000',
  // ) // TODO why doesn't this work
  documents.onDidChangeContent(async event => {
    const absolutePath = event.document.uri.slice(7)
    const fileWatcherEvent: FileWatcherEvent = {
      type: 'UPDATE',
      absolutePath,
      content: event.document.getText(),
    }
    devServer.update([fileWatcherEvent])
  })

  documents.onDidOpen(() => {
    console.log('opened document')
  })
  console.log('listening on 3000')
})

documents.listen(connection)
connection.listen()

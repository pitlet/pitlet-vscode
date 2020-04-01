import * as vscode from 'vscode'
import { RequestType } from 'vscode-languageclient'
import { LocalPlugin } from '../pluginApi'
import { createLanguageClientProxy } from './createLanguageClientProxy'

export const localPluginFormatting: LocalPlugin = async context => {
  if (!vscode.workspace.workspaceFolders) {
    return
  }
  const languageClientProxy = await createLanguageClientProxy(
    context,
    'pitlet',
    'Pitlet',
    {
      documentSelector: [
        {
          scheme: 'file',
        },
      ],
    },
  )

  const folder = vscode.workspace.workspaceFolders![0]

  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(folder, `src/**/*.*`),
  )
  context.subscriptions.push(watcher)
  console.log('created watcher')
  watcher.onDidChange(() => {
    console.log('did change')
  })
  watcher.onDidCreate(() => {
    console.log('did create')
  })
  watcher.onDidDelete(() => {
    console.log('did delete')
  })
}

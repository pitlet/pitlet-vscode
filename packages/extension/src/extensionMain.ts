import 'source-map-support/register'
import * as vscode from 'vscode'
import { localPluginFormatting } from './local-plugins/local-plugin-formatting/localPluginExt'
import { LocalPlugin } from './local-plugins/pluginApi'

const LOCAL_PLUGINS: LocalPlugin[] = [localPluginFormatting]

export const activate: (
  context: vscode.ExtensionContext,
) => Promise<void> = async context => {
  await Promise.all(LOCAL_PLUGINS.map(localPlugin => localPlugin(context)))
}

import * as vscode from "vscode"
import { WebSocketServer } from "ws"

export function activate(context: vscode.ExtensionContext) {

    console.log("VS Code Listener is aaaaaaaaaaactive.")

    const wss = new WebSocketServer({ port: 54321, host: "127.0.0.1" })

    wss.on("connection", (ws) => {
        console.log("Chrome connected!")

        ws.on("message", async (message) => {
            const incomingData = JSON.parse(message.toString())

						if (incomingData.channel === "page-info") {
                    await vscode.commands.executeCommand("workbench.action.closeAllEditors")

                    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
                        const rootUri = vscode.workspace.workspaceFolders[0].uri
                        const rootEntries = await vscode.workspace.fs.readDirectory(rootUri)

                        const targetEntry = rootEntries.find(([name, type]) => 
                            type === vscode.FileType.Directory && name.startsWith(incomingData.content)
                        )

                        if (targetEntry) {
                            const targetUri = vscode.Uri.joinPath(rootUri, targetEntry[0])
                            const fileEntries = await vscode.workspace.fs.readDirectory(targetUri)

                            for (const [fileName, type] of fileEntries) {
                                if (type === vscode.FileType.File) {
                                    const fileUri = vscode.Uri.joinPath(targetUri, fileName)
                                    const doc = await vscode.workspace.openTextDocument(fileUri)
                                    await vscode.window.showTextDocument(doc, { preview: false })
                                }
                            }
                        }
                    }
                }

						const result = "message received"
						const reply = {
							id: incomingData.id,
							content: result
						}
						ws.send(JSON.stringify(reply))
        })
    })

    // Cleanup when extension deactivates
    context.subscriptions.push({
        dispose: () => wss.close()
    })
}

export function deactivate() {}
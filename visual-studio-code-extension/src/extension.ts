import * as vscode from 'vscode';
import { WebSocketServer } from 'ws';

export function activate(context: vscode.ExtensionContext) {

    console.log('VS Code Listener is aaaaaaaaaaactive.');

    const wss = new WebSocketServer({ port: 54321, host: '127.0.0.1' });

    wss.on('connection', (ws) => {
        console.log('Chrome connected!');

        ws.on('message', (message) => {
            const data = JSON.parse(message.toString());
						
						console.log(data)
						
            if (data.command === 'openFile') {
                vscode.window.showInformationMessage(`Chrome asked to open: ${data.filename}`);
                
                // Example: Actually creating/opening a generic untitled file
                /*vscode.workspace.openTextDocument({ content: `Content from Chrome: ${data.text}` })
                    .then(doc => vscode.window.showTextDocument(doc));*/
            }
        });
    });

    // Cleanup when extension deactivates
    context.subscriptions.push({
        dispose: () => wss.close()
    });
}

export function deactivate() {}
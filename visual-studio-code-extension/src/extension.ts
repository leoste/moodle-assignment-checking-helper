import * as vscode from 'vscode'
import { WebSocketServer, WebSocket } from 'ws'
import type { WebSocketMessage } from '@shared/types/WebSocketProtocol'
import { handlePageInfo } from './handler/PageInfoHandler'
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from './config'
import type { ChannelHandler } from './types'

/*
TODO: oluline refaktor enne asjade juurdeehitamist
hetkel on visual studio code extensioni projektis muust projektist semantiliselt erinev struktuur.
see takistab extensioni uute funktsionaalsustega laiendamist, kuna see läheks ruttu rõvedaks spagetiks.

1) extension.ts sees on igat tüüpi sõnumite korda üldine websocketi vastuvõtmise kood. sarnast rolli chrome extensioni koodibaasis täidab basecontroller.
seega see osa tuleb refaktorida src/controller/BaseController.ts.
loogika tuleb ehitada üles täpselt samamoodi, nagu chrome extensionis, aga muidugi arvestades siis natukene vscode websocket handling eripäraga.
koodi üksühele duubeldada ei saa, aga loogika saab jääda ja peab samaks jääma.
extension.ts sees on ka channelHandlers nimeline const, kus otsustatakse mis handleri otsa asi suunatakse.
selle asemel saaks teha pageinfocontrolleri, mis pärineb tavacontrollerist.
pärast neid samme liiguks enamik koodist extension.ts seest välja, extension.ts rolliks jääb ainult initialisida controller.
selleks tuleb init-controllers.ts täpselt nagu chrome extensionis, kus on init funktsioon.
ja see ise kutsub kõigi controllerite init funktsioone. täpselt nagu google chrome extensionsi tehtud!
nii peabki olema: extension.ts ei olegi muud koodi kui oluliste asjade käima panemine, täpselt nagu muudes moodulites.

2) handler/pageinfohandler.ts sees on loogika ühte tüüpi sõnumi protsessimiseks.
see olemuslikult muutuks pageinfoservice nimeliseks asjaks, mida siis pageinfocontroller kasutaks.
async function handlePageInfo asemel tuleks minna samasugule service struktuurile nagu mujal projektis.
ehk oleks class, imporditav klassiinstance, ja tehtaks pageInfoService.handlePageInfo(...) kus seda kasutatakse.
selle liigutusega tekiks siis juurde ka init-services.ts fail ja extension.ts kutsuks välja sellest init funktsiooni.
init-services.ts init funktsiooni sees init-itakse pageinfoservice.
TÄPSELT samamoodi, nagu on juba google chrome extensionis tehtud! ei mingit isemõtlemist
*/

const channelHandlers: Record<string, ChannelHandler> = {
  'page-info': handlePageInfo,
}

export function activate(context: vscode.ExtensionContext): void {
  console.log('Moodle Checking Helper: VS Code extension active.')

  const wss = new WebSocketServer({ port: WEBSOCKET_PORT, host: WEBSOCKET_HOST })

  wss.on('connection', (ws) => {
    console.log('Chrome extension connected.')

    ws.on('message', async (raw) => {
      let data: WebSocketMessage
      try {
        data = JSON.parse(raw.toString()) as WebSocketMessage
      } catch {
        console.error('Failed to parse incoming message:', raw.toString())
        return
      }

      const handler = channelHandlers[data.channel]
      if (!handler) {
        console.warn(`[WebSocketServer] No handler for channel: "${data.channel}"`)
        sendResponse(ws, data.id, 'unhandled')
        return
      }

      try {
        await handler(data, ws)
        sendResponse(ws, data.id, 'ok')
      } catch (err) {
        console.error(`Handler error for channel "${data.channel}":`, err)
        sendResponse(ws, data.id, 'error')
      }
    })

    ws.on('close', () => console.log('Chrome extension disconnected.'))
  })

  context.subscriptions.push({ dispose: () => wss.close() })
}

export function deactivate(): void {}

function sendResponse(ws: WebSocket, id: string, content: unknown): void {
  ws.send(JSON.stringify({ id, content }))
}

import VsCodeMessageGenerator from '@shared/generator/VsCodeMessageGenerator'
import { RECEPTION_HAND_OVER_CHANNEL } from '@shared/constants/vscode-message'
import type { VsCodeMessage } from '@shared/types/VsCodeMessage'
import type { BasePayload } from '@shared/types/payload/BasePayload'

class ReceptionVsCodeMessageGenerator extends VsCodeMessageGenerator {
  getHandOverMessage(): VsCodeMessage<BasePayload> {
    return this.makeMessage(RECEPTION_HAND_OVER_CHANNEL, {})
  }
}

export const receptionVsCodeMessageGenerator = new ReceptionVsCodeMessageGenerator()

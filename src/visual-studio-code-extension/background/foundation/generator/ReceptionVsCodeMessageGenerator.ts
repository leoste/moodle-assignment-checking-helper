import VsCodeMessageGenerator from '@shared/foundation/generator/VsCodeMessageGenerator'
import { RECEPTION_HAND_OVER_CHANNEL } from '@shared/foundation/constants/vscode-message'
import type { VsCodeMessage } from '@shared/business/types/VsCodeMessage'
import type { BasePayload } from '@shared/business/types/BasePayload'

class ReceptionVsCodeMessageGenerator extends VsCodeMessageGenerator {
  getHandOverMessage(): VsCodeMessage<BasePayload> {
    return this.makeMessage(RECEPTION_HAND_OVER_CHANNEL, {})
  }
}

export const receptionVsCodeMessageGenerator = new ReceptionVsCodeMessageGenerator()

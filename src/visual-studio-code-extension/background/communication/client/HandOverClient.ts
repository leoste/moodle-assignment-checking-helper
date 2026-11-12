import type { VsCodeRequestStatus } from '@shared/business/types/VsCodeMessage'
import VsCodeMessageClient from './VsCodeMessageClient'
import { receptionVsCodeMessageGenerator } from '../generator/ReceptionVsCodeMessageGenerator'

class HandOverClient extends VsCodeMessageClient {
  async requestHandOver(): Promise<VsCodeRequestStatus> {
    return this.send(receptionVsCodeMessageGenerator.getHandOverMessage())
  }
}

export const handOverClient = new HandOverClient()

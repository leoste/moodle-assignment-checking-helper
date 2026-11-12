import BaseMessageController from '@shared/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/infrastructure/BaseMessageReceiver'
import type { VsCodeMessagePayloads } from '@shared/types/VsCodeMessagePayloads'
import type { VsCodeMessageHandler } from '../../shared/types/VsCodeMessageHandler'
import { vsCodeMessageReceiver, type RequestResponder } from '../infrastructure/VsCodeMessageReceiver'

export default class VsCodeMessageController extends BaseMessageController<VsCodeMessageHandler, RequestResponder, VsCodeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<VsCodeMessageHandler, RequestResponder> {
    return vsCodeMessageReceiver
  }
}

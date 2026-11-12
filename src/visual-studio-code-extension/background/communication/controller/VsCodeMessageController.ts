import BaseMessageController from '@shared/communication/controller/BaseMessageController'
import type BaseMessageReceiver from '@shared/foundation/infrastructure/BaseMessageReceiver'
import type { VsCodeMessagePayloads } from '@shared/business/types/VsCodeMessagePayloads'
import type { VsCodeMessageHandler } from '../../../shared/business/types/VsCodeMessageHandler'
import { vsCodeMessageReceiver, type RequestResponder } from '../../foundation/infrastructure/VsCodeMessageReceiver'

export default class VsCodeMessageController extends BaseMessageController<VsCodeMessageHandler, RequestResponder, VsCodeMessagePayloads> {
  protected getReceiver(): BaseMessageReceiver<VsCodeMessageHandler, RequestResponder> {
    return vsCodeMessageReceiver
  }
}

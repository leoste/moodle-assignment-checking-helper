import BaseController from '@shared/communication/controller/BaseController'
import { vsCodeCommandReceiver } from '../../foundation/infrastructure/VsCodeCommandReceiver'
import type { VsCodeCommandArguments } from '../../business/types/VsCodeCommandArguments'
import type { VsCodeCommandHandler } from '../../business/types/VsCodeCommandHandler'

export default class VsCodeCommandController extends BaseController {
  protected addCommandHandler<TCommand extends keyof VsCodeCommandArguments & string>(
    command: TCommand,
    handler: VsCodeCommandHandler<VsCodeCommandArguments[TCommand]>,
  ): void {
    vsCodeCommandReceiver.addHandler(command, handler)
  }
}

import BaseController from '@shared/controller/BaseController'
import { vsCodeCommandReceiver } from '../infrastructure/VsCodeCommandReceiver'
import type { VsCodeCommandArguments } from '../types/VsCodeCommandArguments'
import type { VsCodeCommandHandler } from '../types/VsCodeCommandHandler'

export default class VsCodeCommandController extends BaseController {
  protected addCommandHandler<TCommand extends keyof VsCodeCommandArguments & string>(
    command: TCommand,
    handler: VsCodeCommandHandler<VsCodeCommandArguments[TCommand]>,
  ): void {
    vsCodeCommandReceiver.addHandler(command, handler)
  }
}

import BaseController from '@shared/controller/BaseController'

export default abstract class CloseableBaseController extends BaseController {
    close(): void {}
}

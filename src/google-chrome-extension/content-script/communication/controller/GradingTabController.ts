import BaseController from '@shared/communication/controller/BaseController'
import { webLockProvider } from '../../foundation/infrastructure/WebLockProvider'
import { assignmentGraderPageListener } from '../../presentation/listener/AssignmentGraderPageListener'
import { GRADING_TAB_LOCK_NAME } from '../../foundation/constants/locks'

// When another tab takes the grading over, this tab's panel is loaded again, and so shows that the other tab grades.
class GradingTabController extends BaseController {
  protected override onInit(): undefined {
    webLockProvider.setLostHandler(GRADING_TAB_LOCK_NAME, () => {
      void assignmentGraderPageListener.loadPage()
    })
  }
}

export const gradingTabController = new GradingTabController()

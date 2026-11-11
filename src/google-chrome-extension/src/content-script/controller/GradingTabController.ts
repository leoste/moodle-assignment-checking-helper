import BaseController from '@shared/controller/BaseController'
import { webLockProvider } from '../infrastructure/WebLockProvider'
import { assignmentGraderListener } from '../pagelistener/AssignmentGraderListener'
import { GRADING_TAB_LOCK_NAME } from '../constants/locks'

// When another tab takes the grading over, this tab's panel is loaded again, and so shows that the other tab grades.
class GradingTabController extends BaseController {
  protected override onInit(): undefined {
    webLockProvider.setLostHandler(GRADING_TAB_LOCK_NAME, () => {
      void assignmentGraderListener.loadPage()
    })
  }
}

export const gradingTabController = new GradingTabController()

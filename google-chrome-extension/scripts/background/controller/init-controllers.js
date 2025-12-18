import CommonAnswerController from "./CommonAnswerController.js"
import GradePartController from "./GradePartController.js"
import JuhhuuController from "./JuhhuuController.js"
import PageInfoController from "./PageInfoController.js"


export default function initControllers() {  
  new JuhhuuController().init()
  new CommonAnswerController().init()
  new GradePartController().init()
  new PageInfoController().init()
}
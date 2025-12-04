import CommonAnswerController from "./CommonAnswerController.js"
import JuhhuuController from "./JuhhuuController.js"
import PageInfoController from "./PageInfoController.js"


export default function initControllers() {  
  new JuhhuuController().init()
  new CommonAnswerController().init()
  new PageInfoController().init()
}
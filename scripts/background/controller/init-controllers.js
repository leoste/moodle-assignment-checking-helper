import CommonAnswerController from "./CommonAnswerController.js"
import JuhhuuController from "./JuhhuuController.js"


export default function initControllers() {  
  const juhhuuController = new JuhhuuController()
  juhhuuController.init()

  const commonAnswerController = new CommonAnswerController()
  commonAnswerController.init()
}
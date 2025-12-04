import CommonAnswerService from "./CommonAnswerService.js";
import JuhhuuService from "./JuhhuuService.js";

const serviceRegistry = {
  juhhuuService: new JuhhuuService(),
  commonAnswerService: new CommonAnswerService()
}

export default serviceRegistry
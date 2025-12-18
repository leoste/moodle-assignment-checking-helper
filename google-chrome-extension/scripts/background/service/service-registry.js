import CommonAnswerService from "./CommonAnswerService.js";
import GradePartService from "./GradePartService.js";
import JuhhuuService from "./JuhhuuService.js";
import PageInfoService from "./PageInfoService.js";
import WebSocketService from "./WebSocketService.js";

const serviceRegistry = {
  webSocketService: new WebSocketService(),
  juhhuuService: new JuhhuuService(),
  commonAnswerService: new CommonAnswerService(),
  gradePartService: new GradePartService(),
  pageInfoService: new PageInfoService()
}

export default serviceRegistry
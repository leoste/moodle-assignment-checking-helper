import CommonAnswerService from "./CommonAnswerService.js";
import JuhhuuService from "./JuhhuuService.js";
import PageInfoService from "./PageInfoService.js";
import WebSocketService from "./WebSocketService.js";

const serviceRegistry = {
  webSocketService: new WebSocketService(),
  juhhuuService: new JuhhuuService(),
  commonAnswerService: new CommonAnswerService(),
  pageInfoService: new PageInfoService()
}

export default serviceRegistry
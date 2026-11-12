import HandlerMap from './HandlerMap'
import type { MessageHandler } from '../../business/types/MessageHandler'

export default class MessageHandlerMap<T extends MessageHandler> extends HandlerMap<T> {}

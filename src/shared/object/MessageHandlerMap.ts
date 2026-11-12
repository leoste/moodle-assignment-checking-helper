import HandlerMap from './HandlerMap'
import type { MessageHandler } from '../types/MessageHandler'

export default class MessageHandlerMap<T extends MessageHandler> extends HandlerMap<T> {}

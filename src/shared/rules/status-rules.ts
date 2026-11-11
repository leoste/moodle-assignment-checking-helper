import type { Status, StatusLevel } from '../types/Status'
import type { VsCodeRequestStatus } from '../types/VsCodeMessage'
import {
  STATUS_LEVEL_INFO,
  STATUS_LEVEL_PROBLEM,
  STATUS_LEVEL_PROGRESS,
  STATUS_TOPIC_CONNECTION,
  STATUS_TOPIC_STUDENT_SUBMISSION,
} from '../constants/status'
import {
  REQUEST_STATUS_NO_ANSWER,
  REQUEST_STATUS_UNREACHABLE,
  RESPONSE_STATUS_ERROR,
  RESPONSE_STATUS_NO_WORKSPACE,
  RESPONSE_STATUS_NOT_FOUND,
  RESPONSE_STATUS_NOTHING_OPENED,
  RESPONSE_STATUS_OK,
  RESPONSE_STATUS_UNHANDLED,
} from '../constants/vscode-message'
import { translations } from '../translations/translations'

// No connection right now, but one can be made: the connection was closed while idle, or hasn't been needed yet.
export function getWaitingStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_INFO, text: translations.connection.waiting }
}

// A connection attempt failed.
export function getDisconnectedStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_INFO, text: translations.connection.disconnected }
}

export function getReconnectingStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_PROGRESS, text: translations.connection.reconnecting }
}

export function getConnectedStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_INFO, text: translations.connection.connected }
}

export function getPortInUseStatus(port: number): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_PROBLEM, text: translations.connection.portInUse(port) }
}

export function getServerErrorStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_PROBLEM, text: translations.connection.serverError }
}

export function getTakeOverFailedStatus(): Status {
  return { topic: STATUS_TOPIC_CONNECTION, level: STATUS_LEVEL_PROBLEM, text: translations.connection.takeOverFailed }
}

export function getStudentSubmissionOpeningStatus(studentName: string): Status {
  return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROGRESS, translations.studentSubmission.opening(studentName))
}

export function getStudentSubmissionStatus(studentName: string, requestStatus: VsCodeRequestStatus): Status {
  const texts = translations.studentSubmission
  switch (requestStatus) {
    case RESPONSE_STATUS_OK:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_INFO, texts.opened(studentName))
    case RESPONSE_STATUS_NOTHING_OPENED:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.nothingOpened(studentName))
    case RESPONSE_STATUS_NOT_FOUND:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.notFound(studentName))
    case RESPONSE_STATUS_NO_WORKSPACE:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.noWorkspace)
    case RESPONSE_STATUS_ERROR:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.error(studentName))
    case RESPONSE_STATUS_UNHANDLED:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.unhandled)
    case REQUEST_STATUS_UNREACHABLE:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.unreachable)
    case REQUEST_STATUS_NO_ANSWER:
      return getStudentSubmissionTopicStatus(STATUS_LEVEL_PROBLEM, texts.noAnswer)
  }
}

function getStudentSubmissionTopicStatus(level: StatusLevel, text: string): Status {
  return { topic: STATUS_TOPIC_STUDENT_SUBMISSION, level, text }
}

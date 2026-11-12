import type {
  MISMATCH_MISSING,
  MISMATCH_NOT_ALLOWED,
  MISMATCH_WRONG_TYPE,
  VALUE_TYPE_BOOLEAN,
  VALUE_TYPE_LIST,
  VALUE_TYPE_NULL,
  VALUE_TYPE_NUMBER,
  VALUE_TYPE_OBJECT,
  VALUE_TYPE_TEXT,
} from '../../foundation/constants/sample-check'

export type ValueType =
  | typeof VALUE_TYPE_TEXT
  | typeof VALUE_TYPE_NUMBER
  | typeof VALUE_TYPE_BOOLEAN
  | typeof VALUE_TYPE_LIST
  | typeof VALUE_TYPE_OBJECT
  | typeof VALUE_TYPE_NULL

// Where a value differs from the sample. The path looks like "feedback[0].parts[2].enabled", empty for the whole value.
export type SampleMismatch =
  | { reason: typeof MISMATCH_MISSING; path: string }
  | { reason: typeof MISMATCH_NOT_ALLOWED; path: string }
  | { reason: typeof MISMATCH_WRONG_TYPE; path: string; expectedType: ValueType }

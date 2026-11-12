import type { SampleMismatch, ValueType } from '../../business/types/SampleMismatch'
import {
  MISMATCH_MISSING,
  MISMATCH_NOT_ALLOWED,
  MISMATCH_WRONG_TYPE,
  VALUE_TYPE_BOOLEAN,
  VALUE_TYPE_LIST,
  VALUE_TYPE_NULL,
  VALUE_TYPE_NUMBER,
  VALUE_TYPE_OBJECT,
  VALUE_TYPE_TEXT,
} from '../constants/sample-check'

// Checks a parsed JSON value against a sample of its structure:
// - a value has the same type as the sample's value at the same place;
// - an object has only fields the sample has, and every required one of them;
// - every entry of a list is checked against the sample list's first entry.
// The sample marks a field as optional with an empty value ("", false or 0), any other value marks it as required.
export default function checkAgainstSample(value: unknown, sample: unknown, path = ''): SampleMismatch[] {
  const expectedType = getValueType(sample)
  if (getValueType(value) !== expectedType) {
    return [{ reason: MISMATCH_WRONG_TYPE, path, expectedType }]
  }

  if (expectedType === VALUE_TYPE_LIST) {
    const sampleEntry = (sample as unknown[])[0]
    return (value as unknown[]).flatMap((entry, index) => checkAgainstSample(entry, sampleEntry, `${path}[${index}]`))
  }

  if (expectedType === VALUE_TYPE_OBJECT) {
    return checkObject(value as Record<string, unknown>, sample as Record<string, unknown>, path)
  }

  return []
}

function checkObject(value: Record<string, unknown>, sample: Record<string, unknown>, path: string): SampleMismatch[] {
  const mismatches: SampleMismatch[] = []
  for (const field of Object.keys(value)) {
    if (!hasField(sample, field)) mismatches.push({ reason: MISMATCH_NOT_ALLOWED, path: joinPath(path, field) })
  }
  for (const [field, sampleValue] of Object.entries(sample)) {
    if (hasField(value, field)) {
      mismatches.push(...checkAgainstSample(value[field], sampleValue, joinPath(path, field)))
    } else if (isRequired(sampleValue)) {
      mismatches.push({ reason: MISMATCH_MISSING, path: joinPath(path, field) })
    }
  }
  return mismatches
}

function isRequired(sampleValue: unknown): boolean {
  return sampleValue !== '' && sampleValue !== false && sampleValue !== 0
}

function hasField(object: Record<string, unknown>, field: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, field)
}

function joinPath(path: string, field: string): string {
  return path ? `${path}.${field}` : field
}

function getValueType(value: unknown): ValueType {
  if (typeof value === 'string') return VALUE_TYPE_TEXT
  if (typeof value === 'number') return VALUE_TYPE_NUMBER
  if (typeof value === 'boolean') return VALUE_TYPE_BOOLEAN
  if (Array.isArray(value)) return VALUE_TYPE_LIST
  if (typeof value === 'object' && value !== null) return VALUE_TYPE_OBJECT
  return VALUE_TYPE_NULL
}

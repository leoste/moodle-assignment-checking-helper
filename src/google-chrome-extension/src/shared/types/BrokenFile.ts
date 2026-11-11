import type { SampleMismatch } from './SampleMismatch'

export interface BrokenFile {
  name: string
  // The first place where the file differs from the sample definition. Null when the file isn't valid JSON.
  mismatch: SampleMismatch | null
}

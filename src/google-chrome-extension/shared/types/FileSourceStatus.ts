import type { FileSourceInfo } from './FileSourceInfo'

export interface FileSourceStatus extends FileSourceInfo {
  updatedAt: number | null
}

import type { CachedFile } from './CachedFile'

export interface FileCache {
  files: CachedFile[]
  updatedAt: number
}

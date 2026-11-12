// A file or folder in a folder of the workspace. A symbolic link is neither.
export interface WorkspaceEntry {
  name: string
  isFile: boolean
  isDirectory: boolean
}

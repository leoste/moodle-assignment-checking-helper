// Minimal type declarations for the File System Access API,
// which is not fully covered by TypeScript's built-in lib.dom.d.ts.
// Technically this is foundation, not business, as it declares existing platform relations instead of new business
// objects, but to keep things simple it's placed with other types inside business.

interface FileSystemPermissionDescriptor {
  mode?: 'read' | 'readwrite'
}

interface FileSystemHandle {
  queryPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>
  requestPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>
}

interface FileSystemDirectoryHandle {
  values(): AsyncIterableIterator<FileSystemHandle>
}

interface DirectoryPickerOptions {
  id?: string
  mode?: 'read' | 'readwrite'
  startIn?: FileSystemHandle | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos'
}

interface Window {
  showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>
}

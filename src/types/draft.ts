export interface Draft {
  id: string
  content: string
  tone: string
  createdAt: Date
  folderId?: string | null
  persona?: string | null
  inputText?: string
}

export interface Folder {
  id: string
  name: string
  count: number
} 
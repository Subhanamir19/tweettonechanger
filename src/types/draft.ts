export interface Draft {
  id: string
  content: string
  tone: string
  createdAt: Date
  folderId: string | null
}

export interface Folder {
  id: string
  name: string
  count: number
} 
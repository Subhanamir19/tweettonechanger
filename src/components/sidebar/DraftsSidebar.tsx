"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder, ChevronLeft, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface DraftsSidebarProps {
  folders: { id: string; name: string; count: number }[]
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: (name: string) => void
}

export function DraftsSidebar({ 
  folders, 
  selectedFolderId, 
  onFolderSelect,
  onCreateFolder 
}: DraftsSidebarProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName)
      setNewFolderName("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="w-64 bg-zinc-900 h-screen p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Saved Ideas</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white"
          onClick={() => onFolderSelect(null)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-400">Folders</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <Plus className="h-4 w-4 mr-1" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateFolder()
                    }
                  }}
                />
                <Button onClick={handleCreateFolder}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant="ghost"
              className={`w-full justify-start ${
                selectedFolderId === folder.id ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
              onClick={() => onFolderSelect(folder.id)}
            >
              <Folder className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">{folder.name}</span>
              <span className="text-zinc-500 text-sm">({folder.count})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 
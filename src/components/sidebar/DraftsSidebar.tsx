"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Folder, ChevronLeft, Plus, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

interface DraftsSidebarProps {
  folders: { id: string; name: string; count: number }[]
  selectedFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: (name: string) => void
  loading?: boolean
}

export function DraftsSidebar({ 
  folders, 
  selectedFolderId, 
  onFolderSelect,
  onCreateFolder,
  loading = false
}: DraftsSidebarProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      setIsCreating(true)
      try {
        await onCreateFolder(newFolderName)
        setNewFolderName("")
        setIsDialogOpen(false)
      } catch (error) {
        console.error("Error creating folder:", error)
      } finally {
        setIsCreating(false)
      }
    }
  }

  return (
    <div className="w-64 bg-background border-l border-border h-screen sticky top-0 right-0 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Saved Ideas</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground hover:text-accent"
          onClick={() => onFolderSelect(null)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Folders</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent hover:animate-scale-up">
                <Plus className="h-4 w-4 mr-1" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-fade-in">
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
                <Button 
                  onClick={handleCreateFolder} 
                  className="bg-accent hover:bg-accent/90 hover:animate-scale-up"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-accent animate-spin mb-2" />
            <p className="text-xs text-muted-foreground">Loading folders...</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No folders yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create a folder to organize your tweets</p>
          </div>
        ) : (
          <div className="space-y-1">
            {folders.map((folder, index) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all hover:animate-scale-up ${
                    selectedFolderId === folder.id ? "bg-accent/10 text-accent font-medium" : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                  }`}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <Folder className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{folder.name}</span>
                  <span className="text-muted-foreground text-sm">{folder.count}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
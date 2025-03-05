"use client"

import { useEffect, useState } from "react"
import { DraftsSidebar } from "@/components/sidebar/DraftsSidebar"
import { FeaturesSidebar } from "@/components/sidebar/FeaturesSidebar"
import { TweetToneFeature } from "@/components/features/TweetToneFeature"
import { VoiceChangerFeature } from "@/components/features/VoiceChangerFeature"
import { BrainDumpFeature } from "@/components/features/BrainDumpFeature"
import { ComposeIdeaFeature } from "@/components/features/ComposeIdeaFeature"
import { DraftsDisplay } from "@/components/DraftsDisplay"
import { Draft } from "@/types/draft"

export default function TweetToneCustomizer() {
  const [mounted, setMounted] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string>("tweet-tone")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [folders, setFolders] = useState<{ id: string; name: string; count: number }[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load drafts when folder is selected
  useEffect(() => {
    if (selectedFolderId) {
      const folderDrafts = drafts.filter(draft => draft.folderId === selectedFolderId)
      setDrafts(folderDrafts)
    }
  }, [selectedFolderId])

  const handleCreateFolder = (name: string) => {
    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      count: 0
    }
    setFolders(prev => [...prev, newFolder])
  }

  const handleCopyDraft = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleSaveDraft = (content: string, tone: string) => {
    // Open folder selection dialog or use default folder
    if (folders.length === 0) {
      const defaultFolder = {
        id: Date.now().toString(),
        name: "Default",
        count: 0
      }
      setFolders([defaultFolder])
      
      const newDraft: Draft = {
        id: Date.now().toString(),
        content: content,
        tone: tone,
        createdAt: new Date(),
        folderId: defaultFolder.id
      }
      
      setDrafts(prev => [...prev, newDraft])
      setFolders(prev => 
        prev.map(folder => 
          folder.id === defaultFolder.id 
            ? { ...folder, count: folder.count + 1 }
            : folder
        )
      )
    } else if (folders.length === 1) {
      const folderId = folders[0].id
      
      const newDraft: Draft = {
        id: Date.now().toString(),
        content: content,
        tone: tone,
        createdAt: new Date(),
        folderId: folderId
      }
      
      setDrafts(prev => [...prev, newDraft])
      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId 
            ? { ...folder, count: folder.count + 1 }
            : folder
        )
      )
    }
    // If multiple folders, the component will handle the folder selection
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Features */}
      <FeaturesSidebar 
        selectedFeature={selectedFeature}
        onFeatureSelect={setSelectedFeature}
      />
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedFolderId ? (
          <DraftsDisplay 
            drafts={drafts.filter(draft => draft.folderId === selectedFolderId)} 
            onCopy={handleCopyDraft} 
          />
        ) : (
          <>
            {selectedFeature === "tweet-tone" && (
              <TweetToneFeature 
                onSaveDraft={handleSaveDraft}
                folders={folders}
              />
            )}
            
            {selectedFeature === "voice-changer" && (
              <VoiceChangerFeature />
            )}
            
            {selectedFeature === "brain-dump" && (
              <BrainDumpFeature />
            )}
            
            {selectedFeature === "compose-idea" && (
              <ComposeIdeaFeature />
            )}
          </>
        )}
      </div>
      
      {/* Right Sidebar - Saved Ideas */}
      <DraftsSidebar 
        folders={folders} 
        selectedFolderId={selectedFolderId} 
        onFolderSelect={setSelectedFolderId}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
}

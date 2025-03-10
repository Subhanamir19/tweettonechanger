"use client"

import { useEffect, useState } from "react"
import { DraftsSidebar } from "@/components/sidebar/DraftsSidebar"
import { FeaturesSidebar } from "@/components/sidebar/FeaturesSidebar"
import { TweetToneFeature } from "@/components/features/TweetToneFeature"
import { VoiceChangerFeature } from "@/components/features/VoiceChangerFeature"
import { BrainDumpFeature } from "@/components/features/BrainDumpFeature"
import { ComposeIdeaFeature } from "@/components/features/ComposeIdeaFeature"
import { DraftsDisplay } from "@/components/DraftsDisplay"
import { 
  saveTweet,
  getTweetsByFolder,
  getFolders,
  createFolder,
  Tweet,
  Folder
} from "@/lib/supabase"

// Use a fixed user ID for all operations
const FIXED_USER_ID = "anonymous-user"

export default function TweetToneCustomizer() {
  const [mounted, setMounted] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string>("tweet-tone")
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([])
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Load data when component mounts
  useEffect(() => {
    if (mounted) {
      console.log('Component mounted, loading data');
      loadFolders();
      loadTweets();
    }
  }, [mounted, selectedFolderId]);

  const loadFolders = async () => {
    try {
      setDataLoading(true)
      console.log('Fetching folders')
      
      const folderData = await getFolders(FIXED_USER_ID)
      console.log('Folders loaded:', folderData.length)
      setFolders(folderData)
    } catch (error) {
      console.error("Error loading folders:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const loadTweets = async () => {
    try {
      setDataLoading(true)
      console.log('Fetching tweets for folder:', selectedFolderId)
      
      const tweetData = await getTweetsByFolder(FIXED_USER_ID, selectedFolderId)
      console.log('Tweets loaded:', tweetData.length)
      setTweets(tweetData)
    } catch (error) {
      console.error("Error loading tweets:", error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleCreateFolder = async (name: string) => {
    try {
      console.log('Creating folder:', name)
      
      const newFolder = await createFolder(FIXED_USER_ID, name.trim())
      console.log('Folder created:', newFolder)
      setFolders(prev => [...prev, newFolder])
    } catch (error) {
      console.error("Error creating folder:", error)
    }
  }

  const handleCopyDraft = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleSaveDraft = async (content: string, tone: string, persona: string | null = null, inputText: string = "") => {
    try {
      // If no folders exist, create a default one
      if (folders.length === 0) {
        await handleCreateFolder("Default")
      }
      
      const newTweet = await saveTweet(
        FIXED_USER_ID,
        inputText || content,
        content,
        tone,
        persona,
        selectedFolderId
      )
      
      if (newTweet) {
        setTweets(prev => [newTweet, ...prev])
      }
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left sidebar with features */}
      <FeaturesSidebar 
        selectedFeature={selectedFeature} 
        onFeatureSelect={setSelectedFeature} 
      />
      
      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {selectedFeature === "tweet-tone" ? (
          <TweetToneFeature onSave={handleSaveDraft} />
        ) : selectedFeature === "voice-changer" ? (
          <VoiceChangerFeature onSave={handleSaveDraft} />
        ) : selectedFeature === "brain-dump" ? (
          <BrainDumpFeature onSave={handleSaveDraft} />
        ) : selectedFeature === "compose-idea" ? (
          <ComposeIdeaFeature onSave={handleSaveDraft} />
        ) : selectedFeature === "drafts" ? (
          <DraftsDisplay 
            tweets={tweets.map(tweet => ({
              id: tweet.id,
              content: tweet.generated_tweet,
              tone: tweet.tone,
              persona: tweet.persona,
              date: new Date(tweet.created_at).toLocaleDateString()
            }))} 
            onCopy={handleCopyDraft} 
            loading={dataLoading}
          />
        ) : null}
      </div>
      
      {/* Right sidebar with drafts */}
      <DraftsSidebar 
        folders={folders.map(folder => ({
          id: folder.id,
          name: folder.name,
          count: tweets.filter(t => 
            (selectedFolderId === folder.id && t.folder_id === folder.id) || 
            (!selectedFolderId && !t.folder_id)
          ).length
        }))} 
        selectedFolderId={selectedFolderId}
        onFolderSelect={setSelectedFolderId}
        onCreateFolder={handleCreateFolder}
        loading={dataLoading}
      />
    </div>
  )
} 
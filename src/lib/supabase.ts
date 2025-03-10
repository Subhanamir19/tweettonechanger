import { createClient } from '@supabase/supabase-js'

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Tweet = {
  id: string
  user_id: string
  input_text: string
  generated_tweet: string
  folder_id: string | null
  tone: string
  persona: string | null
  created_at: string
}

export type Folder = {
  id: string
  user_id: string
  name: string
  created_at: string
}

// Helper functions for working with tweets
export const saveTweet = async (
  userId: string,
  inputText: string,
  generatedTweet: string,
  tone: string,
  persona: string | null = null,
  folderId: string | null = null
) => {
  const { data, error } = await supabase
    .from('tweets')
    .insert([
      {
        user_id: userId,
        input_text: inputText,
        generated_tweet: generatedTweet,
        tone: tone,
        persona: persona,
        folder_id: folderId
      }
    ])
    .select()

  if (error) {
    console.error('Error saving tweet:', error)
    throw error
  }

  return data?.[0]
}

export const getTweetsByFolder = async (userId: string, folderId: string | null) => {
  let query = supabase
    .from('tweets')
    .select('*')
    .eq('user_id', userId)
  
  if (folderId) {
    query = query.eq('folder_id', folderId)
  } else {
    query = query.is('folder_id', null)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching tweets:', error)
    throw error
  }
  
  return data as Tweet[]
}

export const updateTweetFolder = async (tweetId: string, folderId: string | null) => {
  const { data, error } = await supabase
    .from('tweets')
    .update({ folder_id: folderId })
    .eq('id', tweetId)
    .select()
  
  if (error) {
    console.error('Error updating tweet folder:', error)
    throw error
  }
  
  return data?.[0]
}

export const deleteTweet = async (tweetId: string) => {
  const { error } = await supabase
    .from('tweets')
    .delete()
    .eq('id', tweetId)
  
  if (error) {
    console.error('Error deleting tweet:', error)
    throw error
  }
  
  return true
}

// Helper functions for working with folders
export const createFolder = async (userId: string, name: string) => {
  const { data, error } = await supabase
    .from('folders')
    .insert([
      {
        user_id: userId,
        name: name
      }
    ])
    .select()
  
  if (error) {
    console.error('Error creating folder:', error)
    throw error
  }
  
  return data?.[0]
}

export const getFolders = async (userId: string) => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching folders:', error)
    throw error
  }
  
  return data as Folder[]
}

export const deleteFolder = async (folderId: string) => {
  // First, update all tweets in this folder to have no folder
  const { error: updateError } = await supabase
    .from('tweets')
    .update({ folder_id: null })
    .eq('folder_id', folderId)
  
  if (updateError) {
    console.error('Error updating tweets in folder:', updateError)
    throw updateError
  }
  
  // Then delete the folder
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', folderId)
  
  if (error) {
    console.error('Error deleting folder:', error)
    throw error
  }
  
  return true
} 
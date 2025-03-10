import { NextRequest, NextResponse } from 'next/server'
import { createFolder, deleteFolder, getFolders } from '@/lib/supabase'

// Use a fixed user ID for all operations
const FIXED_USER_ID = "anonymous-user"

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/folders request received')
    
    const folders = await getFolders(FIXED_USER_ID)
    console.log('Folders fetched:', folders.length)
    return NextResponse.json(folders)
  } catch (error) {
    console.error('Error fetching folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 })
    }

    const folder = await createFolder(FIXED_USER_ID, name)
    return NextResponse.json(folder)
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json({ error: 'Failed to create folder', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('id')
    
    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
    }

    await deleteFolder(folderId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting folder:', error)
    return NextResponse.json({ error: 'Failed to delete folder', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
} 
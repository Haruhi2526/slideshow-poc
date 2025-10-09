import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL接続プールの設定
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// アルバム一覧を取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    // テストユーザーの場合はデフォルトアルバムを返す
    if (userId === 'test-user-1') {
      const defaultAlbum = {
        id: 'default-beach-album',
        title: 'ビーチの思い出',
        description: '美しいビーチでの楽しい時間を記録したアルバムです。',
        thumbnail_url: '/beach-sunset.png',
        photo_count: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      return NextResponse.json({ albums: [defaultAlbum] })
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `SELECT 
          a.id, 
          a.title, 
          a.description, 
          a.thumbnail_url, 
          a.photo_count, 
          a.created_at, 
          a.updated_at 
        FROM albums a 
        WHERE a.user_id = $1 AND a.is_active = true 
        ORDER BY a.updated_at DESC`,
        [userId]
      )
      
      return NextResponse.json({ albums: result.rows })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('アルバム一覧取得エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

// 新しいアルバムを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, thumbnailUrl } = body
    
    if (!userId || !title) {
      return NextResponse.json({ error: 'ユーザーIDとタイトルが必要です' }, { status: 400 })
    }

    // テストユーザーの場合は仮のアルバムデータを返す
    if (userId === 'test-user-1') {
      const testAlbum = {
        id: Date.now(), // タイムスタンプをIDとして使用
        title: title,
        description: description || null,
        thumbnail_url: thumbnailUrl || null,
        photo_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return NextResponse.json({ album: testAlbum }, { status: 201 })
    }

    const client = await pool.connect()
    
    try {
      const result = await client.query(
        `INSERT INTO albums (user_id, title, description, thumbnail_url) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, title, description, thumbnail_url, photo_count, created_at, updated_at`,
        [userId, title, description || null, thumbnailUrl || null]
      )
      
      return NextResponse.json({ album: result.rows[0] }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('アルバム作成エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// PostgreSQL接続プールの設定
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// デフォルトアルバムの写真データ
const DEFAULT_PHOTOS = [
  {
    filename: 'beach-sunset.png',
    file_path: '/beach-sunset.png',
    file_size: 1024000,
    mime_type: 'image/png',
    width: 1920,
    height: 1080,
    display_order: 1
  },
  {
    filename: 'beach-umbrella.jpg',
    file_path: '/beach-umbrella.jpg',
    file_size: 856000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1280,
    display_order: 2
  },
  {
    filename: 'summer-beach-family.jpg',
    file_path: '/summer-beach-family.jpg',
    file_size: 1200000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1080,
    display_order: 3
  },
  {
    filename: 'sandcastle.jpg',
    file_path: '/sandcastle.jpg',
    file_size: 950000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1280,
    display_order: 4
  },
  {
    filename: 'seashells.jpg',
    file_path: '/seashells.jpg',
    file_size: 780000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1080,
    display_order: 5
  },
  {
    filename: 'ocean-waves.png',
    file_path: '/ocean-waves.png',
    file_size: 1100000,
    mime_type: 'image/png',
    width: 1920,
    height: 1080,
    display_order: 6
  }
]

// デフォルトアルバムを作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'ユーザーIDが必要です' }, { status: 400 })
    }

    // テストユーザーの場合はローカルストレージにデフォルトアルバムを作成
    if (userId === 'test-user-1') {
      const defaultAlbum = {
        id: 'default-beach-album',
        title: 'ビーチの思い出',
        description: '美しいビーチでの楽しい時間を記録したアルバムです。',
        thumbnail_url: '/beach-sunset.png',
        photo_count: DEFAULT_PHOTOS.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // ローカルストレージにアルバム情報を保存
      const albumsKey = 'user_albums'
      const existingAlbums = JSON.parse(localStorage.getItem(albumsKey) || '[]')
      
      // 既にデフォルトアルバムが存在するかチェック
      const existingDefaultAlbum = existingAlbums.find((album: any) => album.id === 'default-beach-album')
      if (existingDefaultAlbum) {
        return NextResponse.json({ 
          album: existingDefaultAlbum,
          message: 'デフォルトアルバムは既に存在します'
        }, { status: 200 })
      }

      // 新しいデフォルトアルバムを追加
      existingAlbums.unshift(defaultAlbum)
      localStorage.setItem(albumsKey, JSON.stringify(existingAlbums))

      // 写真データも保存
      const photosKey = `album_${defaultAlbum.id}_photos`
      localStorage.setItem(photosKey, JSON.stringify(DEFAULT_PHOTOS))

      return NextResponse.json({ album: defaultAlbum }, { status: 201 })
    }

    const client = await pool.connect()
    
    try {
      // 既にデフォルトアルバムが存在するかチェック
      const existingAlbum = await client.query(
        `SELECT id FROM albums WHERE user_id = $1 AND title = 'ビーチの思い出' AND is_active = true`,
        [userId]
      )

      if (existingAlbum.rows.length > 0) {
        return NextResponse.json({ 
          album: existingAlbum.rows[0],
          message: 'デフォルトアルバムは既に存在します'
        }, { status: 200 })
      }

      // デフォルトアルバムを作成
      const albumResult = await client.query(
        `INSERT INTO albums (user_id, title, description, thumbnail_url, photo_count) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, title, description, thumbnail_url, photo_count, created_at, updated_at`,
        [userId, 'ビーチの思い出', '美しいビーチでの楽しい時間を記録したアルバムです。', '/beach-sunset.png', DEFAULT_PHOTOS.length]
      )

      const album = albumResult.rows[0]

      // 写真データを挿入
      for (const photo of DEFAULT_PHOTOS) {
        await client.query(
          `INSERT INTO photos (album_id, filename, file_path, file_size, mime_type, width, height, display_order) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [album.id, photo.filename, photo.file_path, photo.file_size, photo.mime_type, photo.width, photo.height, photo.display_order]
        )
      }
      
      return NextResponse.json({ album }, { status: 201 })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('デフォルトアルバム作成エラー:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}

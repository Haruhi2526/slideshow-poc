// 画像を圧縮してBase64に変換する関数
export async function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // アスペクト比を保持しながらリサイズ
      const { width, height } = calculateDimensions(img.width, img.height, maxWidth)
      
      canvas.width = width
      canvas.height = height
      
      // 画像を描画
      ctx?.drawImage(img, 0, 0, width, height)
      
      // Base64に変換
      const base64 = canvas.toDataURL('image/jpeg', quality)
      resolve(base64)
    }
    
    img.onerror = () => reject(new Error('画像の読み込みに失敗しました'))
    img.src = URL.createObjectURL(file)
  })
}

// 画像のリサイズ寸法を計算する関数
function calculateDimensions(originalWidth: number, originalHeight: number, maxWidth: number) {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight }
  }
  
  const ratio = maxWidth / originalWidth
  return {
    width: maxWidth,
    height: Math.round(originalHeight * ratio)
  }
}

// ストレージから写真データを読み込む関数
export function loadPhotosFromStorage(albumId: string): any[] {
  try {
    const key = `album_${albumId}_photos`
    const data = localStorage.getItem(key)
    
    if (!data) return []
    
    // 大きなデータの場合はチャンク化されている可能性がある
    const chunks = data.split('|CHUNK|')
    if (chunks.length > 1) {
      // チャンク化されたデータを結合
      const combinedData = chunks.join('')
      return JSON.parse(combinedData)
    }
    
    return JSON.parse(data)
  } catch (error) {
    console.warn('写真データの読み込みに失敗しました:', error)
    return []
  }
}

// 写真データをストレージに保存する関数
export function savePhotosToStorage(albumId: string, photos: any[]): void {
  try {
    const key = `album_${albumId}_photos`
    const data = JSON.stringify(photos)
    
    // データが大きすぎる場合はチャンク化
    const maxChunkSize = 1024 * 1024 // 1MB
    if (data.length > maxChunkSize) {
      const chunks = []
      for (let i = 0; i < data.length; i += maxChunkSize) {
        chunks.push(data.slice(i, i + maxChunkSize))
      }
      
      // チャンクを結合して保存
      const chunkedData = chunks.join('|CHUNK|')
      localStorage.setItem(key, chunkedData)
    } else {
      localStorage.setItem(key, data)
    }
  } catch (error) {
    console.error('写真データの保存に失敗しました:', error)
    throw new Error('ストレージの容量が不足しているか、データが大きすぎます')
  }
}

// ストレージ使用量をチェックする関数
export function checkStorageUsage() {
  // ブラウザのストレージAPIを使用してストレージ使用量をチェック
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    return navigator.storage.estimate().then(estimate => {
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const available = quota > used;
      
      return {
        used: used,
        quota: quota,
        available: available,
        usagePercentage: quota > 0 ? (used / quota) * 100 : 0
      };
    }).catch(() => {
      // エラーの場合はデフォルト値を返す
      return {
        used: 0,
        quota: 0,
        available: true,
        usagePercentage: 0
      };
    });
  }
  
  // ストレージAPIが利用できない場合はデフォルト値を返す
  return Promise.resolve({
    used: 0,
    quota: 0,
    available: true,
    usagePercentage: 0
  });
}

// 同期版のストレージ使用量チェック（簡易版）
export function checkStorageUsageSync() {
  try {
    // localStorageの使用量を概算
    let localStorageSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        localStorageSize += localStorage[key].length + key.length;
      }
    }
    
    // sessionStorageの使用量を概算
    let sessionStorageSize = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        sessionStorageSize += sessionStorage[key].length + key.length;
      }
    }
    
    const totalUsed = localStorageSize + sessionStorageSize;
    
    return {
      used: totalUsed,
      available: true,
      usagePercentage: 0 // 簡易版では正確な割合は計算しない
    };
  } catch (error) {
    console.warn('ストレージ使用量のチェックに失敗しました:', error);
    return {
      used: 0,
      available: true,
      usagePercentage: 0
    };
  }
}

// デフォルトアルバムの写真データ
const DEFAULT_PHOTOS = [
  {
    id: 1,
    filename: 'beach-sunset.png',
    file_path: '/beach-sunset.png',
    file_size: 1024000,
    mime_type: 'image/png',
    width: 1920,
    height: 1080,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 2,
    filename: 'beach-umbrella.jpg',
    file_path: '/beach-umbrella.jpg',
    file_size: 856000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1280,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 3,
    filename: 'summer-beach-family.jpg',
    file_path: '/summer-beach-family.jpg',
    file_size: 1200000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1080,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 4,
    filename: 'sandcastle.jpg',
    file_path: '/sandcastle.jpg',
    file_size: 950000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1280,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 5,
    filename: 'seashells.jpg',
    file_path: '/seashells.jpg',
    file_size: 780000,
    mime_type: 'image/jpeg',
    width: 1920,
    height: 1080,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 6,
    filename: 'ocean-waves.png',
    file_path: '/ocean-waves.png',
    file_size: 1100000,
    mime_type: 'image/png',
    width: 1920,
    height: 1080,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  }
]

// デフォルトアルバムを初期化する関数
export function initializeDefaultAlbum(): any {
  const defaultAlbum = {
    id: 'default-beach-album',
    title: 'ビーチの思い出',
    description: '美しいビーチでの楽しい時間を記録したアルバムです。',
    thumbnail_url: '/beach-sunset.png',
    photo_count: DEFAULT_PHOTOS.length,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  try {
    // アルバム一覧を取得または初期化
    const albumsKey = 'user_albums'
    const existingAlbums = JSON.parse(localStorage.getItem(albumsKey) || '[]')
    
    // 既にデフォルトアルバムが存在するかチェック
    const existingDefaultAlbum = existingAlbums.find((album: any) => album.id === 'default-beach-album')
    if (existingDefaultAlbum) {
      return existingDefaultAlbum
    }

    // 新しいデフォルトアルバムを追加
    existingAlbums.unshift(defaultAlbum)
    localStorage.setItem(albumsKey, JSON.stringify(existingAlbums))

    // 写真データも保存
    const photosKey = `album_${defaultAlbum.id}_photos`
    localStorage.setItem(photosKey, JSON.stringify(DEFAULT_PHOTOS))

    return defaultAlbum
  } catch (error) {
    console.error('デフォルトアルバムの初期化に失敗しました:', error)
    return null
  }
}

// デフォルトアルバムが存在するかチェックする関数
export function hasDefaultAlbum(): boolean {
  try {
    const albumsKey = 'user_albums'
    const existingAlbums = JSON.parse(localStorage.getItem(albumsKey) || '[]')
    return existingAlbums.some((album: any) => album.id === 'default-beach-album')
  } catch (error) {
    console.warn('デフォルトアルバムのチェックに失敗しました:', error)
    return false
  }
}
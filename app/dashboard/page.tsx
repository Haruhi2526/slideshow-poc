'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ImageIcon, Calendar, LogOut, Heart, CheckCircle, Settings, Trash2 } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { CreateAlbumDialog } from "@/components/CreateAlbumDialog"
import { checkStorageUsage, checkStorageUsageSync } from "@/lib/storage"


export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const auth = useAuth()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [albums, setAlbums] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showStorageSettings, setShowStorageSettings] = useState(false)
  const [storageStatus, setStorageStatus] = useState({ used: 0, available: true })
  
  // 認証情報が利用できない場合のフォールバック
  const user = auth?.user || null
  const logout = auth?.logout || (() => {
    console.warn('logout function not available')
    router.push('/')
  })
  // ストレージ使用量をチェック
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const status = await checkStorageUsage()
        setStorageStatus(status)
      } catch (error) {
        console.warn('ストレージ使用量のチェックに失敗しました:', error)
        // フォールバックとして同期版を使用
        const fallbackStatus = checkStorageUsageSync()
        setStorageStatus(fallbackStatus)
      }
    }
    
    checkStorage()
  }, [])

  // アルバム一覧を取得
  const fetchAlbums = async () => {
    const userId = user?.id

    try {
      const response = await fetch(`/api/albums?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setAlbums(data.albums || [])
      } else {
        console.error('アルバム取得に失敗しました')
        setAlbums([])
      }
    } catch (error) {
      console.error('アルバム取得エラー:', error)
      setAlbums([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const login = searchParams.get('login')
    if (login === 'success') {
      setShowSuccessMessage(true)
      // 3秒後にメッセージを非表示にする
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  useEffect(() => {
    fetchAlbums()
  }, [user])

  // 新しいアルバムが作成された時のコールバック
  const handleAlbumCreated = (newAlbum: any) => {
    setAlbums(prev => [newAlbum, ...prev])
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const clearAllStorage = () => {
    if (confirm('すべてのローカルデータを削除しますか？この操作は元に戻せません。')) {
      localStorage.clear()
      setStorageStatus({ used: 0, available: true })
      alert('すべてのデータが削除されました')
    }
  }

  const formatStorageSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">思い出アルバム</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-primary/20">
                <AvatarImage src={user?.picture_url || "/diverse-user-avatars.png"} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.display_name ? user.display_name.charAt(0) : "ユ"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {user?.display_name || "ゲスト"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user ? "ログイン中" : "未ログイン"}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setShowStorageSettings(true)}
              title="ストレージ設定"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
              title="ログアウト"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">ログインに成功しました！</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 text-balance">あなたのアルバム</h2>
            <p className="text-muted-foreground">大切な思い出を整理して、美しいスライドショーを作成しましょう</p>
          </div>
          <CreateAlbumDialog onAlbumCreated={handleAlbumCreated} />
        </div>

        {/* Storage Settings Dialog */}
        {showStorageSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  ストレージ設定
                </CardTitle>
                <CardDescription>
                  ローカルストレージの使用状況と管理
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">ストレージ使用量</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>使用済み:</span>
                      <span className={storageStatus.available ? 'text-green-600' : 'text-red-600'}>
                        {formatStorageSize(storageStatus.used)}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          storageStatus.available ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((storageStatus.used / (5 * 1024 * 1024)) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {storageStatus.available ? '容量に余裕があります' : '容量が不足しています'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={clearAllStorage}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    すべてのデータを削除
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    この操作は元に戻せません。すべてのアルバムと写真が削除されます。
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowStorageSettings(false)}
                >
                  閉じる
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // ローディング状態
            Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="overflow-hidden border-0">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="h-10 w-full bg-muted rounded animate-pulse" />
                </CardFooter>
              </Card>
            ))
          ) : albums.length > 0 ? (
            albums.map((album) => (
              <Card
                key={album.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer border-0"
              >
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={album.thumbnail_url || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-balance">{album.title}</CardTitle>
                  <CardDescription className="text-pretty">{album.description}</CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ImageIcon className="w-4 h-4" />
                      <span>{album.photo_count || 0}枚</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(album.updated_at).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant="secondary"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => router.push(`/album/${album.id}`)}
                  >
                    アルバムを開く
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            // アルバムが存在しない場合
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">まだアルバムがありません</h3>
              <p className="text-muted-foreground mb-6">
                最初のアルバムを作成して、思い出を整理しましょう
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}


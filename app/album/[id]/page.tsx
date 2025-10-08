'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Upload, Play, GripVertical, Trash2, Heart, Edit2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function AlbumDetailPage() {
  const router = useRouter()
  const params = useParams()
  const albumId = params.id as string
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  
  // アルバムデータ
  const albums = {
    "1": {
      title: "夏の思い出 2024",
      description: "海辺での家族旅行。美しい夕日と楽しい思い出がたくさん詰まったアルバムです。",
      photoCount: 24,
      updatedAt: "2024年8月15日",
      basePhotos: [
        { url: "/beach-sunset.png", filename: "beach-sunset.jpg" },
        { url: "/diverse-family-portrait.png", filename: "family-portrait.jpg" },
        { url: "/ocean-waves.png", filename: "ocean-waves.jpg" },
        { url: "/sandcastle.jpg", filename: "sandcastle.jpg" },
        { url: "/beach-umbrella.jpg", filename: "beach-umbrella.jpg" },
        { url: "/seashells.jpg", filename: "seashells.jpg" },
      ],
      photoPrefix: "beach"
    },
    "2": {
      title: "子供の成長記録",
      description: "1歳の誕生日パーティー。初めてのケーキに興味深々な表情が印象的でした。",
      photoCount: 18,
      updatedAt: "2024年7月20日",
      basePhotos: [
        { url: "/baby-birthday-celebration.jpg", filename: "birthday-cake.jpg" },
        { url: "/diverse-family-portrait.png", filename: "family-photo.jpg" },
        { url: "/placeholder.jpg", filename: "candle-blowing.jpg" },
        { url: "/placeholder.jpg", filename: "gift-opening.jpg" },
        { url: "/placeholder.jpg", filename: "party-decorations.jpg" },
        { url: "/placeholder.jpg", filename: "happy-moments.jpg" },
      ],
      photoPrefix: "birthday"
    },
    "3": {
      title: "桜の季節",
      description: "お花見ピクニック。満開の桜の下で家族と過ごした特別な時間。",
      photoCount: 32,
      updatedAt: "2024年4月5日",
      basePhotos: [
        { url: "/cherry-blossom-picnic.png", filename: "cherry-blossoms.jpg" },
        { url: "/placeholder.jpg", filename: "picnic-setup.jpg" },
        { url: "/placeholder.jpg", filename: "sakura-petals.jpg" },
        { url: "/placeholder.jpg", filename: "family-under-trees.jpg" },
        { url: "/placeholder.jpg", filename: "spring-lunch.jpg" },
        { url: "/placeholder.jpg", filename: "memories.jpg" },
      ],
      photoPrefix: "sakura"
    }
  }

  // 動的に写真を生成する関数
  const generatePhotos = (album: any) => {
    const photos = []
    const basePhotos = album.basePhotos || []
    const totalCount = album.photoCount
    
    for (let i = 0; i < totalCount; i++) {
      if (i < basePhotos.length) {
        // 既存の写真を使用
        photos.push({
          id: i + 1,
          url: basePhotos[i].url,
          filename: basePhotos[i].filename
        })
      } else {
        // プレースホルダー写真を生成
        photos.push({
          id: i + 1,
          url: "/placeholder.jpg",
          filename: `${album.photoPrefix}-photo-${i + 1}.jpg`
        })
      }
    }
    
    return photos
  }

  // アップロードされた写真を読み込む
  useEffect(() => {
    const savedPhotos = localStorage.getItem(`album_${albumId}_photos`)
    if (savedPhotos) {
      setUploadedPhotos(JSON.parse(savedPhotos))
    }
  }, [albumId])

  const currentAlbum = albums[albumId as keyof typeof albums]
  const basePhotos = currentAlbum ? generatePhotos(currentAlbum) : []
  
  // アップロードされた写真とベース写真を結合
  const photos = [...basePhotos, ...uploadedPhotos]

  // プレビュー機能
  const openPreview = (index: number) => {
    setPreviewIndex(index)
    setPreviewOpen(true)
  }

  const closePreview = () => {
    setPreviewOpen(false)
  }

  const goToPrevious = () => {
    setPreviewIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setPreviewIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  // 削除機能
  const deletePhoto = (photoId: number) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId)
    
    // アップロードされた写真のみをローカルストレージに保存
    const uploadedOnly = updatedPhotos.filter(photo => photo.uploadedAt)
    localStorage.setItem(`album_${albumId}_photos`, JSON.stringify(uploadedOnly))
    
    // 状態を更新
    setUploadedPhotos(uploadedOnly)
    
    // プレビューが開いている場合は閉じる
    if (previewOpen) {
      setPreviewOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{currentAlbum?.title || "アルバム"}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="shadow-lg hover:scale-105 transition-transform"
              onClick={() => router.push(`/album/${albumId}/upload`)}
            >
              <Upload className="w-5 h-5 mr-2" />
              写真をアップロード
            </Button>
            <Button size="lg" className="shadow-lg hover:scale-105 transition-transform">
              <Play className="w-5 h-5 mr-2" />
              スライドショーを作成
            </Button>
            <Avatar className="border-2 border-primary/20">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary/10 text-primary">田中</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Album Info */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Input
                  defaultValue={currentAlbum?.title || "アルバム"}
                  className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                defaultValue={currentAlbum?.description || "アルバムの説明"}
                className="resize-none border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                rows={2}
              />
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{photos.length}枚の写真</span>
                <span>•</span>
                <span>最終更新: {currentAlbum?.updatedAt || "不明"}</span>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Photos Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">写真一覧</h2>
            <p className="text-sm text-muted-foreground">ドラッグして並び替えができます</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <Card
                key={photo.id}
                className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0"
                onClick={() => openPreview(index)}
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.filename}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="bg-card/90 hover:bg-card"
                      onClick={(e) => {
                        e.stopPropagation()
                        // ドラッグ機能は後で実装
                      }}
                    >
                      <GripVertical className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="bg-card/90 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        deletePhoto(photo.id)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Order Badge */}
                  <div className="absolute top-2 left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground truncate">{photo.filename}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>{photos[previewIndex]?.filename || "写真プレビュー"}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {previewIndex + 1} / {photos.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePhoto(photos[previewIndex]?.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={closePreview}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative p-6">
            {/* Navigation Buttons */}
            {photos.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {/* Image */}
            <div className="flex items-center justify-center min-h-[400px]">
              <img
                src={photos[previewIndex]?.url || "/placeholder.svg"}
                alt={photos[previewIndex]?.filename || "プレビュー"}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            
            {/* Thumbnail Strip */}
            {photos.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setPreviewIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === previewIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.filename}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

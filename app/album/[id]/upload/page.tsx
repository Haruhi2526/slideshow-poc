'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Upload, Heart, X, AlertTriangle } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { savePhotosToStorage, loadPhotosFromStorage, checkStorageUsage, compressImage } from "@/lib/storage"

export default function UploadPage() {
  const router = useRouter()
  const params = useParams()
  const albumId = params.id as string
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)

  // アルバムデータ（簡略版）
  const albums = {
    "1": { title: "夏の思い出 2024" },
    "2": { title: "子供の成長記録" },
    "3": { title: "桜の季節" }
  }

  const currentAlbum = albums[albumId as keyof typeof albums]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    setStorageWarning(false)

    try {
      // ストレージ使用量をチェック
      const storageStatus = await checkStorageUsage()
      if (!storageStatus.available) {
        setStorageWarning(true)
        throw new Error('ストレージの容量が不足しています。古いデータを削除してください。')
      }

      // 各ファイルを圧縮してアップロード
      const uploadPromises = uploadedFiles.map(async (file) => {
        // 実際のアップロード処理をシミュレート
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // 画像を圧縮してBase64に変換
        return await compressImage(file, 1920, 0.8)
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      // 既存の写真データを読み込み
      const existingPhotos = loadPhotosFromStorage(albumId)
      const newPhotos = uploadedImages.map((imageData, index) => ({
        id: Date.now() + index,
        url: imageData,
        filename: uploadedFiles[index].name,
        uploadedAt: new Date().toISOString()
      }))
      
      // 新しい写真データを追加
      const updatedPhotos = [...existingPhotos, ...newPhotos]
      
      // チャンク化してストレージに保存
      savePhotosToStorage(albumId, updatedPhotos)
      
      // アップロード完了後、アルバム詳細ページに戻る
      router.push(`/album/${albumId}`)
    } catch (error) {
      console.error('Upload failed:', error)
      alert(error instanceof Error ? error.message : 'アップロードに失敗しました')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/album/${albumId}`)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground">{currentAlbum?.title || "アルバム"} - 写真をアップロード</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              size="lg" 
              className="shadow-lg hover:scale-105 transition-transform"
              onClick={handleUpload}
              disabled={uploadedFiles.length === 0 || isUploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              {isUploading ? 'アップロード中...' : `アップロード (${uploadedFiles.length})`}
            </Button>
            <Avatar className="border-2 border-primary/20">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary/10 text-primary">田中</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Storage Warning */}
        {storageWarning && (
          <Card className="mb-6 border-destructive/50 bg-destructive/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <h4 className="font-semibold text-destructive">ストレージ容量不足</h4>
                  <p className="text-sm text-destructive/80">
                    ストレージの容量が不足しています。古いアルバムのデータを削除するか、写真のサイズを小さくしてください。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area */}
        <Card className="mb-8 border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all">
          <CardContent className="p-12">
            <div 
              className={`text-center transition-all duration-300 ${
                dragActive ? 'scale-105' : ''
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className={`mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                dragActive ? 'scale-110 bg-primary/20' : ''
              }`}>
                <Upload className={`w-8 h-8 text-primary transition-all duration-300 ${
                  dragActive ? 'scale-110' : ''
                }`} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {dragActive ? 'ファイルをドロップしてください' : '写真をアップロード'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {dragActive ? 'ここにファイルをドロップ' : 'ドラッグ&ドロップまたはクリックして写真を追加'}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button size="lg" asChild>
                  <span>ファイルを選択</span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-4">JPEG, PNG, WebP形式 • 自動圧縮 • 最大10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-foreground">アップロード予定の写真 ({uploadedFiles.length}枚)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-card/90 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

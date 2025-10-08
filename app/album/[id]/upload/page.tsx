'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Upload, Heart, X } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"

export default function UploadPage() {
  const router = useRouter()
  const params = useParams()
  const albumId = params.id as string
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

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

    try {
      // 各ファイルをアップロード
      const uploadPromises = uploadedFiles.map(async (file) => {
        // 実際のアップロード処理をシミュレート
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // ファイルをBase64に変換して保存（実際の実装ではサーバーにアップロード）
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })

      const uploadedImages = await Promise.all(uploadPromises)
      
      // ローカルストレージに保存（実際の実装ではサーバーに送信）
      const existingPhotos = JSON.parse(localStorage.getItem(`album_${albumId}_photos`) || '[]')
      const newPhotos = uploadedImages.map((imageData, index) => ({
        id: Date.now() + index,
        url: imageData,
        filename: uploadedFiles[index].name,
        uploadedAt: new Date().toISOString()
      }))
      
      const updatedPhotos = [...existingPhotos, ...newPhotos]
      localStorage.setItem(`album_${albumId}_photos`, JSON.stringify(updatedPhotos))
      
      // アップロード完了後、アルバム詳細ページに戻る
      router.push(`/album/${albumId}`)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('アップロードに失敗しました')
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
              disabled={uploadedFiles.length === 0}
            >
              <Upload className="w-5 h-5 mr-2" />
              アップロード ({uploadedFiles.length})
            </Button>
            <Avatar className="border-2 border-primary/20">
              <AvatarImage src="/diverse-user-avatars.png" />
              <AvatarFallback className="bg-primary/10 text-primary">田中</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
              <p className="text-xs text-muted-foreground mt-4">JPEG, PNG, WebP形式 • 最大10MB</p>
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

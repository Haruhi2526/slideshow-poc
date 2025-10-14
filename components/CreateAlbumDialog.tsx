'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ImageIcon, Calendar } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface CreateAlbumDialogProps {
  onAlbumCreated?: (album: any) => void
}

export function CreateAlbumDialog({ onAlbumCreated }: CreateAlbumDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: ''
  })
  const router = useRouter()
  const auth = useAuth()
  
  const user = auth?.user || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('アルバムタイトルを入力してください')
      return
    }

    setLoading(true)
    
    try {
      // テストユーザーの場合は仮のユーザーIDを使用
      const userId = user?.id || 'test-user-1'
      
      const requestBody = {
        userId: String(userId), // ユーザーIDを文字列に変換
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        thumbnailUrl: formData.thumbnailUrl.trim() || null
      }
      
      console.log('Sending album creation request:', requestBody)
      console.log('User object:', user)
      
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', response.status, errorText)
        throw new Error(`アルバムの作成に失敗しました (${response.status}): ${errorText}`)
      }

      const result = await response.json()
      
      // フォームをリセット
      setFormData({ title: '', description: '', thumbnailUrl: '' })
      setOpen(false)
      
      // コールバック関数を呼び出し
      if (onAlbumCreated) {
        onAlbumCreated(result.album)
      }
      
      // 作成したアルバムページに遷移
      router.push(`/album/${result.album.id}`)
      
    } catch (error) {
      console.error('アルバム作成エラー:', error)
      alert('アルバムの作成に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center min-h-[400px]">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">新しいアルバムを作成</h3>
            <p className="text-muted-foreground text-sm">
              写真をアップロードして
              <br />
              思い出を整理しましょう
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">新しいアルバムを作成</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">アルバムタイトル *</Label>
            <Input
              id="title"
              placeholder="例: 夏の思い出 2024"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              placeholder="アルバムの説明を入力してください（任意）"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">サムネイル画像URL</Label>
            <Input
              id="thumbnailUrl"
              placeholder="https://example.com/image.jpg"
              value={formData.thumbnailUrl}
              onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              アルバムの代表画像を設定できます（任意）
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.title.trim()}
            >
              {loading ? '作成中...' : 'アルバムを作成'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

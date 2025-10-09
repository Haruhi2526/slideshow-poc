'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [isClient, setIsClient] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || hasRedirected) return
    
    console.log('HomePage - 認証状態チェック:', { user, isLoading })
    
    if (!isLoading) {
      if (user) {
        console.log('認証済みユーザー - ダッシュボードにリダイレクト:', user)
        setHasRedirected(true)
        // 認証済みユーザーはダッシュボードにリダイレクト
        router.push('/dashboard')
      } else {
        console.log('未認証ユーザー - 認証ページにリダイレクト')
        setHasRedirected(true)
        // 未認証ユーザーは認証ページにリダイレクト
        router.push('/auth')
      }
    }
  }, [user, isLoading, router, isClient, hasRedirected])

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return null
  }

  // ローディング中
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <div className="w-8 h-8 bg-primary/20 rounded-full"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">読み込み中...</h2>
          <p className="text-muted-foreground">しばらくお待ちください</p>
        </div>
      </div>
    )
  }

  // リダイレクト中の表示
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-xl font-semibold mb-2">リダイレクト中...</h2>
        <p className="text-muted-foreground">適切なページに移動します</p>
      </div>
    </div>
  )
}


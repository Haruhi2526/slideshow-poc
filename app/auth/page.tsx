'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Heart, AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, isLoading } = useAuth()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)

  // 認証済みユーザーはダッシュボードにリダイレクト（一度だけ）
  useEffect(() => {
    if (!isLoading && user && !hasRedirected) {
      console.log('認証済みユーザーをダッシュボードにリダイレクト:', user)
      setHasRedirected(true)
      router.push('/dashboard')
    }
  }, [user, isLoading, router, hasRedirected])

  const handleLineLogin = () => {
    // LINE認証APIにリダイレクト
    window.location.href = '/api/auth/line'
  }

  useEffect(() => {
    const error = searchParams.get('error')
    const token = searchParams.get('token')
    const user = searchParams.get('user')
    
    if (error) {
      switch (error) {
        case 'line_auth_failed':
          setErrorMessage('LINE認証に失敗しました。もう一度お試しください。')
          break
        case 'server_error':
          setErrorMessage('サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。')
          break
        case 'no_code':
          setErrorMessage('認証コードが取得できませんでした。')
          break
        case 'callback_failed':
          setErrorMessage('認証処理に失敗しました。')
          break
        default:
          setErrorMessage('認証エラーが発生しました。')
      }
    }
    
    // LINE認証成功時の処理
    if (token && user && !isProcessing) {
      setIsProcessing(true)
      try {
        const userData = JSON.parse(user)
        console.log('認証データを処理中:', userData)
        login(token, userData)
        
        // 認証状態の更新を待ってからダッシュボードにリダイレクト
        // setTimeoutは削除し、useEffectの認証済みユーザーリダイレクトに任せる
        console.log('認証処理完了 - useEffectでリダイレクトを待機')
      } catch (error) {
        console.error('認証データの処理エラー:', error)
        setErrorMessage('認証データの処理に失敗しました。')
        setIsProcessing(false)
      }
    }
  }, [searchParams, login, router, isProcessing])

  // ローディング中または認証済みユーザーの場合は何も表示しない
  if (isLoading || user) {
    return null
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold mb-2">認証中...</h2>
            <p className="text-muted-foreground">ダッシュボードに移動します</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Camera className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-balance">思い出アルバム</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            大切な写真を美しいスライドショーに
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          
          <Button
            onClick={handleLineLogin}
            className="w-full h-14 text-lg font-semibold bg-[#06C755] hover:bg-[#05B04D] text-white shadow-lg transition-all hover:scale-[1.02]"
            size="lg"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINEでログイン
          </Button>
        </CardContent>
      </Card>

      <div className="fixed bottom-4 right-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Heart className="w-4 h-4 fill-primary text-primary" />
        <span>家族の思い出を大切に</span>
      </div>
    </div>
  )
}

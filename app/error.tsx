'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance">エラーが発生しました</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            申し訳ございません。予期しないエラーが発生しました。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          <div className="p-3 bg-muted/50 border rounded-lg text-sm text-muted-foreground">
            <strong>エラー詳細:</strong>
            <br />
            {error.message || '不明なエラーが発生しました'}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={reset}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              再試行
            </Button>
            
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              ホームに戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

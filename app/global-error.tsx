'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // グローバルエラーをログに記録
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              システムエラー
            </h1>
            <p className="text-gray-600 mb-6">
              申し訳ございません。システムに問題が発生しました。
            </p>
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                再試行
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ホームに戻る
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {error.message && (
                <details className="text-left">
                  <summary className="cursor-pointer">エラー詳細</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {error.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


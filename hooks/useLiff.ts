'use client'

import { useState, useEffect } from 'react'

// LIFF SDKの型定義
declare global {
  interface Window {
    liff: any;
  }
}

interface LiffUser {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

interface UseLiffReturn {
  isLiffReady: boolean
  isLoggedIn: boolean
  user: LiffUser | null
  login: () => void
  logout: () => void
  error: string | null
}

export function useLiff(): UseLiffReturn {
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<LiffUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        // LIFF IDを環境変数から取得
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID || 'YOUR_LIFF_ID'
        
        // LIFF IDが設定されていない場合はエラー
        if (liffId === 'YOUR_LIFF_ID') {
          setError('LIFF IDが設定されていません。環境変数NEXT_PUBLIC_LIFF_IDを設定してください。')
          return
        }
        
        // LIFF SDKが読み込まれているかチェック
        if (!window.liff) {
          setError('LIFF SDKが読み込まれていません')
          return
        }
        
        // LIFFを初期化
        await window.liff.init({ liffId })
        setIsLiffReady(true)

        // ログイン状態をチェック
        if (window.liff.isLoggedIn()) {
          setIsLoggedIn(true)
          // ユーザー情報を取得
          const profile = await window.liff.getProfile()
          setUser({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            statusMessage: profile.statusMessage
          })
        } else {
          setIsLoggedIn(false)
          setUser(null)
        }
      } catch (err) {
        console.error('LIFF初期化エラー:', err)
        setError('LIFFの初期化に失敗しました')
      }
    }

    // LIFF SDKの読み込みを待つ
    const handleLiffSdkLoaded = () => {
      initializeLiff()
    }

    const handleLiffSdkError = () => {
      setError('LIFF SDKの読み込みに失敗しました')
    }

    // イベントリスナーを追加
    window.addEventListener('liff-sdk-loaded', handleLiffSdkLoaded)
    window.addEventListener('liff-sdk-error', handleLiffSdkError)

    // LIFF SDKが既に読み込まれている場合
    if (window.liff) {
      initializeLiff()
    }

    // クリーンアップ
    return () => {
      window.removeEventListener('liff-sdk-loaded', handleLiffSdkLoaded)
      window.removeEventListener('liff-sdk-error', handleLiffSdkError)
    }
  }, [])

  const login = () => {
    if (!isLiffReady) {
      setError('LIFFが初期化されていません')
      return
    }
    
    if (!window.liff.isLoggedIn()) {
      window.liff.login({
        redirectUri: window.location.href
      })
    }
  }

  const logout = () => {
    if (!isLiffReady) {
      setError('LIFFが初期化されていません')
      return
    }
    
    if (window.liff.isLoggedIn()) {
      window.liff.logout()
      setIsLoggedIn(false)
      setUser(null)
    }
  }

  return {
    isLiffReady,
    isLoggedIn,
    user,
    login,
    logout,
    error
  }
}

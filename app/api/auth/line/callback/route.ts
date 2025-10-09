import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// LINE認証のコールバック用API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') || '/'
    const error = searchParams.get('error')
    
    // エラーハンドリング
    if (error) {
      console.error('LINE認証エラー:', error)
      return NextResponse.redirect(`https://slideshow-poc.vercel.app/auth?error=${error}`)
    }
    
    if (!code) {
      return NextResponse.redirect('https://slideshow-poc.vercel.app/auth?error=no_code')
    }
    
    // アクセストークンを取得
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://slideshow-poc.vercel.app/api/auth/line/callback',
        client_id: process.env.LINE_CHANNEL_ID || '',
        client_secret: process.env.LINE_CHANNEL_SECRET || '',
      }),
    })
    
    if (!tokenResponse.ok) {
      throw new Error('トークン取得に失敗しました')
    }
    
    const tokenData = await tokenResponse.json()
    
    // ユーザー情報を取得
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    })
    
    if (!profileResponse.ok) {
      throw new Error('プロフィール取得に失敗しました')
    }
    
    const profile = await profileResponse.json()
    
    // JWTトークンを生成
    const jwtToken = jwt.sign(
      { 
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    
    // フロントエンドにリダイレクト（トークンをクエリパラメータで渡す）
    const redirectUrl = new URL('https://slideshow-poc.vercel.app/auth')
    redirectUrl.searchParams.set('token', jwtToken)
    redirectUrl.searchParams.set('user', JSON.stringify({
      id: profile.userId,
      line_user_id: profile.userId,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    }))
    
    return NextResponse.redirect(redirectUrl.toString())
    
  } catch (error) {
    console.error('LINE認証コールバックエラー:', error)
    return NextResponse.redirect('https://slideshow-poc.vercel.app/auth?error=callback_failed')
  }
}

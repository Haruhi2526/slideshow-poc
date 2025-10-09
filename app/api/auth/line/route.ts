import { NextRequest, NextResponse } from 'next/server'

// LINE認証のリダイレクト用API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const redirectUri = searchParams.get('redirect_uri') || request.headers.get('referer') || '/'
    
    // LINE認証のURLを構築
    const lineAuthUrl = new URL('https://access.line.me/oauth2/v2.1/authorize')
    
    // クエリパラメータを設定
    lineAuthUrl.searchParams.set('response_type', 'code')
    lineAuthUrl.searchParams.set('client_id', process.env.LINE_CHANNEL_ID || '')
    lineAuthUrl.searchParams.set('redirect_uri', 'https://slideshow-poc.vercel.app/api/auth/line/callback')
    lineAuthUrl.searchParams.set('state', redirectUri)
    lineAuthUrl.searchParams.set('scope', 'profile openid')
    
    // LINE認証ページにリダイレクト
    return NextResponse.redirect(lineAuthUrl.toString())
    
  } catch (error) {
    console.error('LINE認証エラー:', error)
    return NextResponse.json(
      { error: '認証に失敗しました' },
      { status: 500 }
    )
  }
}

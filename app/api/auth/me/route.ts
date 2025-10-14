import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// 認証状態確認API
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証トークンが必要です' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    
    // JWTトークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
    
    // ユーザー情報を返す
    return NextResponse.json({
      user: {
        id: decoded.userId,
        line_user_id: decoded.userId,
        display_name: decoded.displayName,
        picture_url: decoded.pictureUrl,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('認証確認エラー:', error)
    return NextResponse.json(
      { error: '認証に失敗しました' },
      { status: 401 }
    )
  }
}


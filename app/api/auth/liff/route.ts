import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// LIFFアプリ用の認証API
export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()
    
    if (!user || !user.userId) {
      return NextResponse.json(
        { error: 'ユーザー情報が不足しています' },
        { status: 400 }
      )
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { 
        userId: user.userId,
        displayName: user.displayName,
        pictureUrl: user.pictureUrl
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // ユーザー情報をデータベースに保存（必要に応じて）
    // ここでは簡単のため、トークンのみを返す
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.userId,
        line_user_id: user.userId,
        display_name: user.displayName,
        picture_url: user.pictureUrl,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('LIFF認証エラー:', error)
    return NextResponse.json(
      { error: '認証に失敗しました' },
      { status: 500 }
    )
  }
}

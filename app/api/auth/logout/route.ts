import { NextRequest, NextResponse } from 'next/server'

// ログアウトAPI
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '認証トークンが必要です' },
        { status: 401 }
      )
    }
    
    // ここでサーバーサイドのセッション管理やトークンの無効化を行う
    // 現在は簡単のため、成功レスポンスのみ返す
    
    return NextResponse.json({
      success: true,
      message: 'ログアウトしました'
    })
    
  } catch (error) {
    console.error('ログアウトエラー:', error)
    return NextResponse.json(
      { error: 'ログアウトに失敗しました' },
      { status: 500 }
    )
  }
}

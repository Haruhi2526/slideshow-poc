# LIFFアプリ設定ガイド

## 概要
このプロジェクトでは、LINE Front-end Framework (LIFF) を使用してLINEログイン機能を実装しています。

## 必要な設定

### 1. LINE Developers Console設定

1. [LINE Developers Console](https://developers.line.biz/console/)にアクセス
2. 新しいプロバイダーを作成（まだ作成していない場合）
3. 新しいチャンネルを作成：
   - チャンネルタイプ: **LIFF**
   - チャンネル名: 任意の名前
   - チャンネル説明: 任意の説明

### 2. LIFFアプリの設定

1. 作成したLIFFチャンネルで「LIFF」タブを選択
2. 「追加」ボタンをクリック
3. 以下の設定を行う：
   - **LIFFアプリ名**: 任意の名前
   - **サイズ**: Full
   - **エンドポイントURL**: `https://your-domain.com`
   - **スコープ**: `profile openid`
   - **ボットリンク**: Normal

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```bash
# LINE Developers設定
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CALLBACK_URL=https://your-domain.com/api/auth/line/callback

# LIFF設定
NEXT_PUBLIC_LIFF_ID=your_liff_id
LIFF_ENDPOINT_URL=https://api.line.me/oauth2/v2.1/authorize

# JWT設定
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# セッション設定
SESSION_SECRET=your-session-secret-key
```

### 4. デプロイメント設定

#### Vercelでのデプロイ

1. `vercel.json`にLIFFアプリの設定を追加：

```json
{
  "functions": {
    "app/api/auth/liff/route.ts": {
      "maxDuration": 10
    }
  },
  "env": {
    "NEXT_PUBLIC_LIFF_ID": "@liff_id",
    "LINE_CHANNEL_ID": "@line_channel_id",
    "LINE_CHANNEL_SECRET": "@line_channel_secret",
    "JWT_SECRET": "@jwt_secret"
  }
}
```

2. Vercelの環境変数を設定：
   - `NEXT_PUBLIC_LIFF_ID`: LIFFアプリのID
   - `LINE_CHANNEL_ID`: LINEチャンネルID
   - `LINE_CHANNEL_SECRET`: LINEチャンネルシークレット
   - `JWT_SECRET`: JWT署名用の秘密鍵

#### その他のプラットフォーム

他のプラットフォーム（Netlify、AWS、GCP等）でも同様に環境変数を設定してください。

## 使用方法

### 1. コンポーネントの使用

```tsx
import LineLoginButton from '@/components/LineLoginButton'

function LoginPage() {
  const handleLoginStart = () => {
    console.log('ログイン開始')
  }

  const handleLoginSuccess = (user: any) => {
    console.log('ログイン成功:', user)
  }

  const handleLoginError = (error: string) => {
    console.error('ログインエラー:', error)
  }

  return (
    <div>
      <LineLoginButton
        onLoginStart={handleLoginStart}
        onLoginSuccess={handleLoginSuccess}
        onLoginError={handleLoginError}
      />
    </div>
  )
}
```

### 2. 認証状態の確認

```tsx
import { useAuth } from '@/hooks/useAuth'

function UserProfile() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>読み込み中...</div>
  }

  if (!user) {
    return <div>ログインしてください</div>
  }

  return (
    <div>
      <h1>こんにちは、{user.display_name}さん</h1>
      <img src={user.picture_url} alt="プロフィール画像" />
      <button onClick={logout}>ログアウト</button>
    </div>
  )
}
```

## トラブルシューティング

### よくある問題

1. **LIFFが初期化されない**
   - `NEXT_PUBLIC_LIFF_ID`が正しく設定されているか確認
   - LIFFアプリのエンドポイントURLが正しいか確認

2. **ログインが失敗する**
   - LINEチャンネルの設定を確認
   - スコープの設定を確認（`profile openid`が必要）

3. **デプロイ後に動作しない**
   - 環境変数が正しく設定されているか確認
   - HTTPSでアクセスしているか確認（LIFFはHTTPS必須）

### デバッグ方法

1. ブラウザの開発者ツールでコンソールログを確認
2. NetworkタブでAPIリクエストの状況を確認
3. LIFFの状態を確認：

```tsx
import { useLiff } from '@/hooks/useLiff'

function DebugInfo() {
  const { isLiffReady, isLoggedIn, user, error } = useLiff()
  
  return (
    <div>
      <p>LIFF Ready: {isLiffReady ? 'Yes' : 'No'}</p>
      <p>Logged In: {isLoggedIn ? 'Yes' : 'No'}</p>
      <p>User: {user ? user.displayName : 'None'}</p>
      <p>Error: {error || 'None'}</p>
    </div>
  )
}
```

## セキュリティ考慮事項

1. **JWT秘密鍵**: 強力な秘密鍵を使用し、環境変数で管理
2. **HTTPS**: 本番環境では必ずHTTPSを使用
3. **CORS**: 適切なCORS設定を行う
4. **トークン有効期限**: 適切な有効期限を設定

## 参考資料

- [LIFF公式ドキュメント](https://developers.line.biz/ja/docs/liff/)
- [LINE Login API](https://developers.line.biz/ja/docs/line-login/)
- [Next.js環境変数](https://nextjs.org/docs/basic-features/environment-variables)

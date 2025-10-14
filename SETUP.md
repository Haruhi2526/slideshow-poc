# スライドショーアプリケーション セットアップ手順

## 概要
このプロジェクトは、Next.js 15とLIFF（LINE Front-end Framework）を使用したスライドショーアプリケーションです。LINEログイン機能、アルバム管理、写真アップロード機能を提供します。

## 技術スタック
- **フロントエンド**: Next.js 15, React 19, TypeScript
- **UI**: Radix UI, Tailwind CSS
- **認証**: LINE Login, LIFF, JWT
- **データベース**: Neon Database (PostgreSQL)
- **デプロイ**: Vercel
- **パッケージマネージャー**: pnpm

## 1. 必要なパッケージのインストール

### pnpmのインストール（推奨）
```bash
npm install -g pnpm
```

### 依存関係のインストール
```bash
pnpm install
```

### 主要な依存関係
- `@line/liff`: LINE Front-end Framework
- `@neondatabase/serverless`: Neon Database接続
- `@radix-ui/*`: UIコンポーネント
- `next`: Next.js フレームワーク
- `react-hook-form`: フォーム管理
- `zod`: バリデーション

## 2. 環境変数の設定

### 環境変数ファイルの作成
```bash
cp env.example .env.local
```

### 必要な環境変数
`.env.local`ファイルを編集して、以下の値を設定してください：

```bash
# LINE Developers設定
LINE_CHANNEL_ID=your_line_channel_id
LINE_CHANNEL_SECRET=your_line_channel_secret
LINE_CALLBACK_URL=https://your-domain.com/api/auth/line/callback

# LIFF設定
NEXT_PUBLIC_LIFF_ID=your_liff_id

# JWT設定
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# セッション設定
SESSION_SECRET=your-session-secret-key-make-it-long-and-random

# データベース設定（Neon Database推奨）
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## 3. データベースのセットアップ

### Neon Database（推奨）
1. [Neon Console](https://console.neon.tech/)にアクセス
2. 新しいプロジェクトを作成
3. 接続文字列を取得して`DATABASE_URL`に設定
4. SQLエディタで`database-schema.sql`を実行

### ローカルPostgreSQL
```bash
# PostgreSQLのインストール（macOS）
brew install postgresql
brew services start postgresql

# データベースの作成
createdb slideshow_db

# テーブルの作成
psql -U postgres -d slideshow_db -f database-schema.sql
```

## 4. LINE Developersコンソールでの設定

### LIFFチャンネルの作成
1. [LINE Developers Console](https://developers.line.biz/console/)にアクセス
2. 新しいプロバイダーを作成
3. **LIFF**チャンネルを作成
4. LIFFアプリを追加：
   - **サイズ**: Full
   - **エンドポイントURL**: `https://your-domain.com`
   - **スコープ**: `profile openid`

### LINE Loginチャンネルの作成（オプション）
1. **LINE Login**チャンネルを作成
2. コールバックURLを設定: `https://your-domain.com/api/auth/line/callback`

## 5. アプリケーションの起動

### 開発環境
```bash
pnpm dev
```

### 本番環境
```bash
pnpm build
pnpm start
```

## 6. デプロイメント

### Vercelでのデプロイ
1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ

### 環境変数の設定（Vercel）
- `NEXT_PUBLIC_LIFF_ID`
- `LINE_CHANNEL_ID`
- `LINE_CHANNEL_SECRET`
- `JWT_SECRET`
- `DATABASE_URL`
- `SESSION_SECRET`

## 7. 主要機能

### 認証機能
- LINEログイン（LIFF）
- JWT トークン認証
- セッション管理

### アルバム管理
- アルバムの作成・編集・削除
- 写真のアップロード
- ドラッグ&ドロップでの並び替え

### スライドショー
- フルスクリーンスライドショー
- 自動再生機能
- 手動操作

## 8. トラブルシューティング

### よくある問題
1. **LIFFが初期化されない**
   - `NEXT_PUBLIC_LIFF_ID`が正しく設定されているか確認
   - HTTPSでアクセスしているか確認

2. **データベース接続エラー**
   - `DATABASE_URL`が正しく設定されているか確認
   - Neon Databaseの接続制限を確認

3. **認証エラー**
   - LINEチャンネルの設定を確認
   - スコープの設定を確認

### デバッグ方法
```bash
# ログの確認
pnpm dev

# 型チェック
pnpm lint
```

## 9. 開発ガイド

### プロジェクト構造
```
app/
├── api/           # API ルート
├── auth/          # 認証ページ
├── dashboard/     # ダッシュボード
├── slideshow/     # スライドショー
└── album/         # アルバム管理

components/
├── ui/            # UIコンポーネント
└── *.tsx          # カスタムコンポーネント

hooks/             # カスタムフック
lib/               # ユーティリティ関数
```

### コーディング規約
- TypeScriptを使用
- ESLintとPrettierでコード品質を維持
- コンポーネントは関数型で記述
- カスタムフックでロジックを分離

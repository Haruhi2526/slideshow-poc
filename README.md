# スライドショーアプリケーション

LINEログイン機能を統合したモダンなスライドショーアプリケーションです。Next.js 15とLIFF（LINE Front-end Framework）を使用して構築されています。

## 🚀 主な機能

- **LINEログイン**: LIFFを使用したシームレスな認証
- **アルバム管理**: 写真のアップロード・整理・管理
- **スライドショー**: フルスクリーンでの写真表示
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **ドラッグ&ドロップ**: 直感的な写真の並び替え

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **UI**: Radix UI, Tailwind CSS
- **認証**: LINE Login, LIFF, JWT
- **データベース**: Neon Database (PostgreSQL)
- **デプロイ**: Vercel
- **パッケージマネージャー**: pnpm

## 📋 前提条件

- Node.js 18以上
- pnpm（推奨）
- LINE Developersアカウント
- Neon Databaseアカウント（またはPostgreSQL）

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd slideshow-poc
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

```bash
cp env.example .env.local
```

`.env.local`ファイルを編集して、必要な環境変数を設定してください。

### 4. データベースのセットアップ

Neon DatabaseまたはPostgreSQLでデータベースを作成し、`database-schema.sql`を実行してください。

### 5. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## 📚 詳細なセットアップ

詳細なセットアップ手順については、以下のドキュメントを参照してください：

- [SETUP.md](./SETUP.md) - 包括的なセットアップガイド
- [LIFF_SETUP.md](./LIFF_SETUP.md) - LIFFアプリの設定方法

## 🏗️ プロジェクト構造

```
slideshow-poc/
├── app/                    # Next.js App Router
│   ├── api/               # API ルート
│   ├── auth/              # 認証ページ
│   ├── dashboard/         # ダッシュボード
│   ├── slideshow/        # スライドショー
│   └── album/             # アルバム管理
├── components/            # Reactコンポーネント
│   ├── ui/               # Radix UIコンポーネント
│   └── *.tsx             # カスタムコンポーネント
├── hooks/                # カスタムフック
├── lib/                  # ユーティリティ関数
├── public/               # 静的ファイル
└── styles/               # スタイルファイル
```

## 🔧 開発

### 利用可能なスクリプト

```bash
# 開発サーバーの起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバーの起動
pnpm start

# リント
pnpm lint
```

### コーディング規約

- TypeScriptを使用
- ESLintとPrettierでコード品質を維持
- コンポーネントは関数型で記述
- カスタムフックでロジックを分離

## 🚀 デプロイ

### Vercelでのデプロイ

1. Vercelアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数を設定
4. デプロイ

詳細は[SETUP.md](./SETUP.md)のデプロイメントセクションを参照してください。

## 🔒 環境変数

必要な環境変数：

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

# データベース設定
DATABASE_URL=postgresql://username:password@host:port/database_name
```

## 🐛 トラブルシューティング

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

詳細なトラブルシューティング情報は[LIFF_SETUP.md](./LIFF_SETUP.md)を参照してください。

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します。詳細は[CONTRIBUTING.md](./CONTRIBUTING.md)を参照してください。

## 📞 サポート

質問やサポートが必要な場合は、GitHubのIssuesページでお知らせください。

---

**注意**: このプロジェクトは開発中のプロトタイプです。本番環境での使用前に十分なテストを行ってください。
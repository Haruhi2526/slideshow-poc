# LINEログイン機能のセットアップ手順

## 1. 必要なパッケージのインストール
npm install express passport passport-line jsonwebtoken pg dotenv cors express-session bcryptjs

# 開発用パッケージ
npm install --save-dev @types/passport @types/jsonwebtoken @types/pg @types/express-session @types/bcryptjs @types/cors

## 2. 環境変数の設定
cp env.example .env
# .envファイルを編集して、実際の値を設定してください

## 3. PostgreSQLデータベースのセットアップ

### PostgreSQLがインストールされていない場合
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# https://www.postgresql.org/download/windows/ からインストーラーをダウンロード

### データベースの作成方法

#### 方法1: createdbコマンドを使用（推奨）
# PostgreSQLがインストールされている場合
createdb slideshow_db

#### 方法2: psqlコマンドを使用
# PostgreSQLに接続してデータベースを作成
psql -U postgres
CREATE DATABASE slideshow_db;
\q

#### 方法3: SQLコマンドで直接作成
# psqlでpostgresデータベースに接続して作成
psql -U postgres -d postgres -c "CREATE DATABASE slideshow_db;"

### テーブルの作成
# 作成したデータベースに接続してテーブルを作成
psql -U postgres -d slideshow_db -f database-schema.sql

# または、psqlに接続してから実行
psql -U postgres -d slideshow_db
\i database-schema.sql

## 4. LINE Developersコンソールでの設定
# 1. https://developers.line.biz/ にアクセス
# 2. プロバイダーを作成
# 3. チャネルを作成（LINE Login）
# 4. チャネルIDとチャネルシークレットを取得
# 5. コールバックURLを設定: http://localhost:3000/api/auth/line/callback

## 5. アプリケーションの起動
node app.js

## 6. フロントエンドでの使用例
# LineLoginButtonコンポーネントを使用
# useAuthフックで認証状態を管理

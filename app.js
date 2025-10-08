// app.js
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24時間
  }
}));

// Passport初期化
app.use(passport.initialize());
app.use(passport.session());

// ルート設定
app.use('/api/auth', require('./routes/auth'));

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('エラー:', err);
  res.status(500).json({
    success: false,
    message: 'サーバーエラーが発生しました'
  });
});

// 404ハンドリング
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'エンドポイントが見つかりません'
  });
});

app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});

module.exports = app;

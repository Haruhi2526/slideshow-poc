// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// PostgreSQL接続設定
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// JWT認証ミドルウェア
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'アクセストークンが必要です'
      });
    }
    
    // JWTトークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // データベースから最新のユーザー情報を取得
    const userQuery = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
    const userResult = await pool.query(userQuery, [decoded.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }
    
    req.user = userResult.rows[0];
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        message: '無効なトークンです'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'トークンの有効期限が切れています'
      });
    } else {
      console.error('認証エラー:', error);
      return res.status(500).json({
        success: false,
        message: 'サーバーエラーが発生しました'
      });
    }
  }
};

// オプショナル認証ミドルウェア（認証が失敗しても処理を続行）
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userQuery = 'SELECT * FROM users WHERE id = $1 AND is_active = true';
      const userResult = await pool.query(userQuery, [decoded.id]);
      
      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // エラーが発生しても処理を続行
    next();
  }
};

// 管理者権限チェックミドルウェア
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({
      success: false,
      message: '管理者権限が必要です'
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};

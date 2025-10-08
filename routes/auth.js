// routes/auth.js
const express = require('express');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// JWT生成関数
const generateJWT = (user) => {
  const payload = {
    id: user.id,
    line_user_id: user.line_user_id,
    display_name: user.display_name,
    picture_url: user.picture_url
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// LINE認証開始
router.get('/line', passport.authenticate('line', {
  scope: ['profile', 'openid']
}));

// LINE認証コールバック
router.get('/line/callback', 
  passport.authenticate('line', { 
    failureRedirect: '/auth?error=line_auth_failed' 
  }),
  async (req, res) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: '認証に失敗しました'
        });
      }
      
      // JWTトークンを生成
      const token = generateJWT(user);
      
      // JWTトークンをクッキーに保存
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7日間
      });
      
      // 成功時にメインページにリダイレクト
      res.redirect('/?login=success');
      
    } catch (error) {
      console.error('LINE認証コールバックエラー:', error);
      res.redirect('/auth?error=server_error');
    }
  }
);

// ログアウト
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'ログアウトに失敗しました'
      });
    }
    
    res.json({
      success: true,
      message: 'ログアウトしました'
    });
  });
});

// 認証状態確認
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// JWT認証ミドルウェア
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'アクセストークンが必要です'
    });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: '無効なトークンです'
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = router;

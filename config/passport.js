// config/passport.js
const passport = require('passport');
const LineStrategy = require('passport-line').Strategy;
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

// LINE Strategy設定
passport.use(new LineStrategy({
  channelID: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  callbackURL: process.env.LINE_CALLBACK_URL || "http://localhost:3000/api/auth/line/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('LINE Profile:', profile);
    
    const { id, displayName, pictureUrl } = profile;
    
    // データベースでユーザーを検索
    const userQuery = 'SELECT * FROM users WHERE line_user_id = $1';
    const userResult = await pool.query(userQuery, [id]);
    
    let user;
    
    if (userResult.rows.length === 0) {
      // 新規ユーザー作成
      const insertQuery = `
        INSERT INTO users (line_user_id, display_name, picture_url, last_login_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      const insertResult = await pool.query(insertQuery, [id, displayName, pictureUrl]);
      user = insertResult.rows[0];
      console.log('新規ユーザー作成:', user);
    } else {
      // 既存ユーザーのログイン時刻更新
      const updateQuery = `
        UPDATE users 
        SET last_login_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE line_user_id = $1
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [id]);
      user = updateResult.rows[0];
      console.log('既存ユーザーログイン:', user);
    }
    
    return done(null, user);
  } catch (error) {
    console.error('LINE認証エラー:', error);
    return done(error, null);
  }
}));

// セッションシリアライゼーション（必要に応じて）
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;

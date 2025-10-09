const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

async function testNeonConnection() {
  try {
    console.log('🔄 Neonデータベースに接続中...');
    const client = await pool.connect();
    console.log('✅ Neonデータベース接続成功！');
    
    // 現在時刻を取得
    const timeResult = await client.query('SELECT NOW()');
    console.log('🕐 データベース時刻:', timeResult.rows[0].now);
    
    // テーブル存在確認
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📋 作成済みテーブル:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // テーブル数確認
    const expectedTables = ['users', 'albums', 'photos'];
    const actualTables = tablesResult.rows.map(row => row.table_name);
    const missingTables = expectedTables.filter(table => !actualTables.includes(table));
    
    if (missingTables.length === 0) {
      console.log('✅ すべてのテーブルが正常に作成されています');
    } else {
      console.log('⚠️  不足しているテーブル:', missingTables);
    }
    
    client.release();
    await pool.end();
    console.log('�� 接続を閉じました');
    
  } catch (err) {
    console.error('❌ Neonデータベース接続エラー:', err.message);
    console.error('💡 確認事項:');
    console.error('   - .env.localファイルが存在するか');
    console.error('   - POSTGRES_URLが正しく設定されているか');
    console.error('   - Neonプロジェクトがアクティブか');
    process.exit(1);
  }
}

testNeonConnection();

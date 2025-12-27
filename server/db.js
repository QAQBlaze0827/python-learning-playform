// server/db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    // ✨ 修改這裡：如果有環境變數就用環境變數，不然就預設 localhost
    // 在 docker-compose 裡我們設定了 DB_HOST=db，所以它會自動連過去
    host: process.env.DB_HOST || 'localhost',
    
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root', // 記得如果是單機跑 XAMPP 這裡通常要留空 ''
    database: process.env.DB_NAME || 'python_learning',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
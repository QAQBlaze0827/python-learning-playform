// server/api/login.post.js
// server/api/login.post.js
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username } = body;

  if (!username) {
    return { success: false, message: '請輸入名字' };
  }

  try {
    // 1. 先檢查這個名字是不是已經存在
    const [existingUsers] = await pool.query(
      // ✨ 修正這裡：原本只有 SELECT id, role... 漏掉了 username！
      'SELECT id, username, role FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      // 舊生：直接回傳 ID
      return { 
        success: true, 
        user: existingUsers[0] 
      };
    } else {
      // 新生：建立新帳號
      const [result] = await pool.query(
        'INSERT INTO users (username, role) VALUES (?, ?)',
        [username, 'student']
      );
      
      return { 
        success: true, 
        user: { id: result.insertId, username, role: 'student' } 
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});
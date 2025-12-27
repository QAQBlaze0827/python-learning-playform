// server/api/get_all_progress.get.js
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  try {
    // 聯表查詢 (JOIN)：把 progress 表跟 users 表連起來，這樣才看得到是「誰」
    // 這裡假設你目前只有 user_id=1 的資料，但寫法是通用的
    const [rows] = await pool.query(`
      SELECT 
        progress.id,
        users.username,
        progress.unit_id,
        progress.completed_at
      FROM progress
      JOIN users ON progress.user_id = users.id
      ORDER BY progress.completed_at DESC
    `);

    return { success: true, data: rows };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
});
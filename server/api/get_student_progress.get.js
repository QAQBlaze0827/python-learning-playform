// server/api/get_student_progress.get.js
import { pool } from '../db';

export default defineEventHandler(async (event) => {
  // 1. 從 Cookie 讀取現在是誰登入
  const cookies = parseCookies(event);
  const userInfoStr = cookies.user_info;

  // 如果沒登入，回傳空陣列
  if (!userInfoStr) {
    return { success: false, progress: [] };
  }

  const user = JSON.parse(userInfoStr);

  try {
    // 2. 去資料庫查這個學生完成過哪些 unit_id
    const [rows] = await pool.query(
      'SELECT unit_id FROM progress WHERE user_id = ?',
      [user.id]
    );

    // 把結果整理成一個簡單的數字陣列，例如：[1, 2] 代表完成過單元 1 和 2
    const completedUnitIds = rows.map(row => row.unit_id);

    return { success: true, progress: completedUnitIds };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
});
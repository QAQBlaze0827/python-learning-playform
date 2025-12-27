// server/api/save_progress.post.js
import { pool } from '../db';

export default defineEventHandler(async (event) => {
    // 1. 讀取前端傳來的資料 (就像 PHP 的 $_POST)
    const body = await readBody(event);
    const { userId, unitId } = body;

    try {
        // 2. 寫入資料庫 (這裡用標準 SQL 寫法)
        const [rows] = await pool.query(
            'INSERT INTO progress (user_id, unit_id, is_completed) VALUES (?, ?, ?)',
            [userId, unitId, true]
        );

        // 3. 回傳成功訊息 (自動轉成 JSON)
        return { success: true, message: '進度已儲存！' };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
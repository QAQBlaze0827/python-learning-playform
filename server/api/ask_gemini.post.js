// server/api/ask_gemini.post.js
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  // 1. 讀取設定檔裡的 API Key
  const config = useRuntimeConfig();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return { success: false, message: 'Server 未設定 API Key' };
  }

  // 2. 接收前端傳來的資料 (學生的程式碼、題目、執行結果)
  const body = await readBody(event);
  const { question, userCode, output } = body;

  try {
    // 3. 設定 Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // 改用這個完整名稱，保證找得到
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. 設計「提示詞 (Prompt)」- 這是靈魂所在
    const prompt = `
      你是一位親切的 Python 程式設計家教。
      
      【題目】：${question}
      【學生寫的程式碼】：
      ${userCode}
      
      【實際執行結果】：
      ${output}
      
      【任務】：
      學生的答案是錯的。請給他一點「思考方向」或「提示」。
      1. 不要直接給出正確程式碼。
      2. 指出他的邏輯哪裡可能怪怪的，或是語法哪裡錯了。
      3. 語氣要鼓勵學生。
      4. 請使用繁體中文回答，字數控制在 100 字以內。
    `;

    // 5. 發送給 Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const hint = response.text();

    return { success: true, hint: hint };

  } catch (error) {
    console.error(error);
    return { success: false, message: 'AI 目前忙碌中，請稍後再試' };
  }
});
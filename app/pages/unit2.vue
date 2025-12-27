<template>
  <div class="min-h-screen bg-gray-100 p-6 pb-20">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      
      <div class="bg-indigo-600 p-6 text-white flex justify-between items-center">
        <h1 class="text-2xl font-bold">單元 2：If 條件判斷 (絕對值)</h1>
        <NuxtLink to="/student" class="text-indigo-100 hover:text-white">返回列表</NuxtLink>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div>
          <div class="mb-8 bg-black rounded-xl overflow-hidden shadow-lg">
            <h2 class="bg-gray-800 text-white px-4 py-2 text-sm font-bold flex items-center gap-2">
              <span>📺</span> 課前教學影片
            </h2>
            <div class="aspect-video">
              <iframe 
                class="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                title="Python Print 教學" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>
          </div>
          <h2 class="text-xl font-bold mb-4 border-b pb-2">📜 題目說明</h2>
          <p class="mb-4 text-gray-700 leading-relaxed">
            數學上的「絕對值」代表一個數字與 0 的距離。例如 |-5| = 5，|3| = 3。<br><br>
            請運用 Python 的 <code>if</code> 和 <code>else</code> 語法，撰寫一個程式：<br>
            1. 預設變數 <code>x = -10</code><br>
            2. 如果 <code>x</code> 小於 0，請印出 <code>-x</code><br>
            3. 否則，請印出 <code>x</code>
          </p>

          <div class="mt-8">
            <h3 class="font-bold text-gray-700 mb-2">執行結果：</h3>
            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono h-32 overflow-auto mb-4">
              <span v-if="output">{{ output }}</span>
              <span v-else class="text-gray-500">等待執行...</span>
            </div>

            <div v-if="aiHint" class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded animate-pulse">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-2xl">🤖</span>
                <h3 class="font-bold text-purple-800">AI 家教小幫手：</h3>
              </div>
              <p class="text-purple-700 text-sm leading-relaxed">{{ aiHint }}</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col h-full">
          <h2 class="text-xl font-bold mb-4 border-b pb-2">💻 撰寫程式碼</h2>
          
          <div class="flex-1 w-full border rounded-lg overflow-hidden shadow-inner h-[50vh] md:h-96">
            <ClientOnly>
              <VueMonacoEditor
                v-model:value="userCode"
                theme="vs-dark"
                language="python"
                :options="editorOptions"
                class="h-full w-full"
              />
              <template #fallback>
                <div class="h-full w-full bg-gray-900 text-gray-400 flex items-center justify-center">
                  載入編輯器中...
                </div>
              </template>
            </ClientOnly>
          </div>
          
          <button 
            @click="runCode" 
            :disabled="isLoading"
            class="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition flex justify-center items-center"
          >
            <span v-if="isLoading">載入 Python 引擎中...</span>
            <span v-else>▶ 執行程式</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// ✨ 1. 引入 Monaco Editor
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';

// 這裡的初始程式碼保留單元 2 的題目
const userCookie = useCookie('user_info')
const userCode = ref('x = -10\n# 請在下方開始寫 if 判斷式\n');
const output = ref('');
const aiHint = ref('');
const isLoading = ref(true);
let pyodide = null;

// ✨ 2. 設定編輯器選項 (黑色主題、自動補全)
const editorOptions = {
  automaticLayout: true,
  fontSize: 16,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 4,
  formatOnType: true,
};

// 初始化 Pyodide
onMounted(async () => {
  // ❌ 刪除：原本建立 script 標籤的那一大段程式碼
  /* const script = document.createElement('script');
  script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
  document.head.appendChild(script);
  script.onload = ... 
  */

  // ✨ 改成：直接檢查全域變數有沒有 loadPyodide
  // 我們設一個定時器檢查，因為 script 加了 defer，可能還沒跑完
  const checkPyodide = setInterval(async () => {
    if (window.loadPyodide) {
      clearInterval(checkPyodide);
      
      // 如果還沒初始化過才初始化
      if (!pyodide) {
        pyodide = await window.loadPyodide();
        // await pyodide.loadPackage("micropip"); // 這行記得刪掉
        isLoading.value = false;
        console.log("Python Ready!");
      }
    }
  }, 100);
});

const runCode = async () => {
  output.value = "執行中...";
  aiHint.value = '';
  
  try {
    pyodide.runPython(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
    `);
    
    await pyodide.runPythonAsync(userCode.value);
    
    const result = pyodide.runPython("sys.stdout.getvalue()");
    output.value = result.trim();

    checkAnswer(output.value);

  } catch (err) {
    output.value = "❌ 語法錯誤：\n" + err;
  }
};

const checkAnswer = async (result) => {
  const cleanResult = result ? result.toString().trim() : "";

  // 單元 2 邏輯檢查 (絕對值應為 10)
  if (cleanResult === "10") {
    alert("🎉 恭喜過關！你學會了絕對值邏輯！");
    
    // 儲存單元 2 的進度
    // 儲存進度
    await $fetch('/api/save_progress', {
      method: 'POST',
      body: { 
        userId: userCookie.value ? userCookie.value.id : 1, // ✨ 這裡改用 cookie 裡的 ID
        unitId: 2 // (注意：單元 2 寫 2，單元 3 寫 3)
      }
    });
    
  } else {
    aiHint.value = "🤔 正在分析你的邏輯...";
    
    try {
      const response = await $fetch('/api/ask_gemini', {
        method: 'POST',
        body: { 
          // 這裡的提示詞針對單元 2
          question: "使用 if else 判斷 x = -10 的絕對值，若 x < 0 印出 -x，否則印出 x", 
          userCode: userCode.value,
          output: cleanResult
        }
      });

      if (response.success) {
        aiHint.value = response.hint;
      } else {
        aiHint.value = "AI 暫時無法回應，請檢查程式碼邏輯。";
      }
    } catch (e) {
      aiHint.value = "連線錯誤。";
    }
  }
};
</script>
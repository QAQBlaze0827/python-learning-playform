<template>
  <div class="min-h-screen bg-gray-100 p-6 pb-20">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      
      <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
        <h1 class="text-2xl font-bold">單元 1：計算長方形面積</h1>
        <NuxtLink to="/student" class="text-blue-100 hover:text-white">返回列表</NuxtLink>
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
                src="https://www.youtube.com/embed/TVDkHGjUv1s"
                title="Python Print 教學" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <h2 class="text-xl font-bold mb-4 border-b pb-2">📜 題目說明</h2>
          <p class="mb-4 text-gray-700 leading-relaxed">
            請你寫一個 Python 程式，計算一個長為 <b>5</b>、寬為 <b>10</b> 的長方形面積。<br>
            並將計算結果使用 <code>print()</code> 印出來。
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
          
          <div class="w-full border rounded-lg overflow-hidden shadow-inner h-[50vh] md:h-96">
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
            class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition flex justify-center items-center"
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
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
const userCookie = useCookie('user_info');
const userCode = ref('# 請在這裡輸入程式碼\n# print');
const output = ref('');
const isLoading = ref(true);
const aiHint = ref('');
let pyodide = null;

// Monaco Editor 設定
const editorOptions = {
  automaticLayout: true,
  fontSize: 16,
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  tabSize: 4,
  formatOnType: true,
};

// 初始化 Python 引擎
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

// 執行程式碼
const runCode = async () => {
  output.value = "執行中...";
  aiHint.value = ''; // 清空舊提示
  
  try {
    // 攔截 print
    pyodide.runPython(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
    `);
    
    // 執行
    await pyodide.runPythonAsync(userCode.value);
    
    // 取得結果
    const result = pyodide.runPython("sys.stdout.getvalue()");
    output.value = result.trim();

    checkAnswer(output.value);

  } catch (err) {
    output.value = "❌ 錯誤：\n" + err;
  }
};

// 檢查答案與呼叫 AI
const checkAnswer = async (result) => {
  const cleanResult = result ? result.toString().trim() : "";

  if (cleanResult === "50") {
    alert("🎉 恭喜！答案正確！(已儲存進度)");
    
    // 儲存進度
    await $fetch('/api/save_progress', {
      method: 'POST',
      body: { 
        userId: userCookie.value ? userCookie.value.id : 1, // ✨ 這裡改用 cookie 裡的 ID
        unitId: 1 // (注意：單元 2 寫 2，單元 3 寫 3)
      }
    });
    
  } else {
    // 答錯呼叫 Gemini
    aiHint.value = "🤔 正在分析你的程式碼，請稍等...";
    try {
      const response = await $fetch('/api/ask_gemini', {
        method: 'POST',
        body: { 
          question: "計算長 5、寬 10 的長方形面積",
          userCode: userCode.value,
          output: cleanResult
        }
      });

      if (response.success) {
        aiHint.value = response.hint;
      } else {
        aiHint.value = "AI 睡著了，請再試一次。";
      }
    } catch (e) {
      aiHint.value = "連線錯誤，無法取得提示。";
    }
  }
};
</script>
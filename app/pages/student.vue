<template>
  <div class="min-h-screen bg-blue-50 p-10">
    <div class="max-w-4xl mx-auto">
      
      <div class="flex justify-between items-center mb-8 border-b pb-4 border-blue-200">
        <h1 class="text-3xl font-bold text-blue-900">課程單元列表</h1>
        
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-sm text-gray-500 hover:text-blue-600 hover:underline">
            回首頁
          </NuxtLink>

          <div class="flex items-center gap-3 pl-6 border-l border-gray-300">
            <span v-if="userCookie" class="text-gray-700 font-medium">
              你好，<span class="text-blue-600">{{ userCookie.username }}</span>
            </span>
            
            <button 
              @click="handleLogout" 
              class="text-sm text-red-500 hover:text-white border border-red-200 hover:bg-red-500 px-3 py-1 rounded transition duration-200"
            >
              登出
            </button>
          </div>
        </div>
      </div>

      <div class="grid gap-6">
        
        <NuxtLink to="/unit1" class="block bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-l-8 border-blue-500 group relative">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold mb-2 group-hover:text-blue-600">單元 1：Print 輸出與運算</h3>
              <p class="text-gray-600">題目：計算長方形面積</p>
            </div>
            <span v-if="isCompleted(1)" class="text-2xl">✅</span>
          </div>
          <div class="mt-4 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">難度：簡單</div>
        </NuxtLink>

        <NuxtLink 
          to="/unit2" 
          :class="['block p-6 rounded-xl shadow transition border-l-8 relative', 
            isLocked(2) ? 'bg-gray-200 border-gray-400 opacity-60 pointer-events-none grayscale' : 'bg-white hover:shadow-lg border-indigo-500 group']"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold mb-2 group-hover:text-indigo-600">
                <span v-if="isLocked(2)">🔒 </span> 單元 2：If 條件判斷 (絕對值)
              </h3>
              <p class="text-gray-600">題目：計算數值的絕對值</p>
            </div>
            <span v-if="isCompleted(2)" class="text-2xl">✅</span>
          </div>
          
          <div v-if="isLocked(2)" class="mt-4 text-sm text-red-500 font-bold">
            🚫 請先完成單元 1 才能解鎖
          </div>
          <div v-else class="mt-4 inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">難度：中等</div>
        </NuxtLink>

        <NuxtLink 
          to="/unit3" 
          :class="['block p-6 rounded-xl shadow transition border-l-8 relative', 
            isLocked(3) ? 'bg-gray-200 border-gray-400 opacity-60 pointer-events-none grayscale' : 'bg-white hover:shadow-lg border-teal-500 group']"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-2xl font-bold mb-2 group-hover:text-teal-600">
                <span v-if="isLocked(3)">🔒 </span>
                單元 3：For 迴圈 (累加運算)
              </h3>
              <p class="text-gray-600">題目：計算 1 到 10 的總和 (Sigma)</p>
            </div>
            <span v-if="isCompleted(3)" class="text-2xl">✅</span>
          </div>

          <div v-if="isLocked(3)" class="mt-4 text-sm text-red-500 font-bold">
            🚫 請先完成單元 2 才能解鎖
          </div>
          <div v-else class="mt-4 inline-block bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">難度：困難</div>
        </NuxtLink>

      </div>
    </div>
  </div>
</template>

<script setup> 
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userCookie = useCookie('user_info');
const completedUnits = ref([]); // ✨ 用來存我做過哪些單元

// ✨ 檢查並撈取進度
onMounted(async () => {
  // 1. 防呆：沒登入踢回去
  if (!userCookie.value) {
    alert('⚠️ 尚未登入，請重新輸入名字！');
    router.push('/');
    return;
  }

  // 2. 撈取進度 API
  try {
    const response = await $fetch('/api/get_student_progress');
    if (response.success) {
      completedUnits.value = response.progress; // 例如：[1] 或 [1, 2]
    }
  } catch (e) {
    console.error('無法讀取進度', e);
  }
});

// ✨ 判斷是否做過 (用來顯示勾勾 ✅)
const isCompleted = (unitId) => {
  return completedUnits.value.includes(unitId);
};

// ✨ 判斷是否要鎖住 (核心邏輯)
const isLocked = (unitId) => {
  if (unitId === 1) return false; // 第一關永遠不鎖
  
  if (unitId === 2) {
    // 如果「沒做過單元 1」，單元 2 就鎖住
    return !completedUnits.value.includes(1);
  }
  
  if (unitId === 3) {
    // 如果「沒做過單元 2」，單元 3 就鎖住
    return !completedUnits.value.includes(2);
  }
  
  return true;
};

const handleLogout = () => {
  userCookie.value = null;
  alert('已成功登出！');
  router.push('/');
};
</script>
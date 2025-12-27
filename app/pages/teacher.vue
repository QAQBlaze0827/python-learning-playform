<template>
  <div class="min-h-screen bg-green-50 p-8">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-green-900">👨‍🏫 老師後台管理系統</h1>
          <p class="text-green-600 mt-2">即時查看學生的學習狀況</p>
        </div>
        <NuxtLink to="/" class="px-4 py-2 bg-white text-green-700 rounded border border-green-300 hover:bg-green-100 transition">
          回首頁
        </NuxtLink>
        <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition shadow">
          登出管理員
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <h3 class="text-gray-500 text-sm font-bold uppercase">總通關次數</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">{{ progressData.length }} <span class="text-sm font-normal text-gray-400">次</span></p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
          <h3 class="text-gray-500 text-sm font-bold uppercase">最近活動學生</h3>
          <p class="text-3xl font-bold text-gray-800 mt-2">
            {{ progressData.length > 0 ? progressData[0].username : '無' }}
          </p>
        </div>
        <div class="bg-white p-6 rounded-xl shadow border-l-4 border-teal-500">
          <h3 class="text-gray-500 text-sm font-bold uppercase">系統狀態</h3>
          <p class="text-3xl font-bold text-teal-600 mt-2">正常運作</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="font-bold text-gray-800 text-lg">學生學習紀錄表</h2>
          <button @click="fetchData" class="text-sm text-blue-500 hover:underline">🔄 重新整理</button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th class="px-6 py-4 font-bold border-b">學生姓名</th>
                <th class="px-6 py-4 font-bold border-b">完成單元</th>
                <th class="px-6 py-4 font-bold border-b">完成時間</th>
                <th class="px-6 py-4 font-bold border-b">狀態</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="item in progressData" :key="item.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {{ item.username.charAt(0).toUpperCase() }}
                    </div>
                    {{ item.username }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span v-if="item.unit_id === 1" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">單元 1: Print</span>
                  <span v-else-if="item.unit_id === 2" class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">單元 2: If/Else</span>
                  <span v-else-if="item.unit_id === 3" class="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">單元 3: For Loop</span>
                  <span v-else class="text-gray-500">未知單元</span>
                </td>
                <td class="px-6 py-4 text-gray-500 text-sm">
                  {{ new Date(item.completed_at).toLocaleString() }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-green-600 font-bold flex items-center gap-1">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span> 已完成
                  </span>
                </td>
              </tr>

              <tr v-if="progressData.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-400">
                  目前還沒有任何學生完成作業喔！
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // ✨ 引入路由工具

const progressData = ref([]);
const router = useRouter();
const teacherCookie = useCookie('is_teacher'); // ✨ 讀取老師通行證

// 撈取資料的函式 (沒變)
const fetchData = async () => {
  try {
    const response = await $fetch('/api/get_all_progress');
    if (response.success) {
      progressData.value = response.data;
    }
  } catch (error) {
    console.error("撈取失敗", error);
  }
};

//登出
const handleLogout = () => {
  // 1. 撕掉老師通行證
  teacherCookie.value = null;
  
  // 2. 踢回首頁
  router.push('/');
};

onMounted(() => {
  // ✨ 警衛檢查站：如果沒有老師通行證，就踢回首頁
  if (!teacherCookie.value) {
    alert('⚠️ 你沒有權限進入後台！請先登入。');
    router.push('/'); // 踢回首頁
    return; // 停止執行後面的程式
  }

  // 如果有通行證，才准許撈資料
  fetchData();
});
</script>
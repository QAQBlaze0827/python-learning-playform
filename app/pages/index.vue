<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-10 text-gray-800">Python 數理邏輯學習網</h1>

    <div class="flex flex-col md:flex-row gap-8">
      
      <div class="w-80 bg-white border-2 border-blue-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl">
        <div class="text-7xl mb-4">👨‍🎓</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">我是學生</h2>
        
        <input 
          v-model="studentName" 
          type="text" 
          placeholder="請輸入你的名字..." 
          class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
          @keyup.enter="handleStudentLogin"
        >
        
        <button 
          @click="handleStudentLogin"
          :disabled="!studentName"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-300 transition"
        >
          開始學習
        </button>
      </div>

      <div class="w-80 bg-white border-2 border-green-200 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 transition-all duration-300 hover:border-green-500 hover:shadow-2xl">
        <div class="text-7xl mb-4">👩‍🏫</div>
        <h2 class="text-2xl font-bold text-gray-700 mb-4">我是老師</h2>
        
        <input 
          v-model="teacherPassword" 
          type="password" 
          placeholder="請輸入後台密碼..." 
          class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 text-center"
          @keyup.enter="handleTeacherLogin"
        >

        <button 
          @click="handleTeacherLogin"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
        >
          登入後台
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const studentName = ref('');
const teacherPassword = ref(''); // ✨ 老師密碼變數
const router = useRouter();
const userCookie = useCookie('user_info');
const teacherCookie = useCookie('is_teacher'); // ✨ 這是老師的專屬通行證

// 學生登入 (跟之前一樣)
const handleStudentLogin = async () => {
  if (!studentName.value) return;
  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: { username: studentName.value }
    });
    if (response.success) {
      userCookie.value = response.user;
      router.push('/student');
    } else {
      alert('登入失敗：' + response.message);
    }
  } catch (err) {
    alert('系統錯誤');
  }
};

// ✨ 老師登入邏輯
const handleTeacherLogin = () => {
  // 這裡設定你的後台密碼，例如 "admin123"
  if (teacherPassword.value === 'admin123') {
    // 密碼對了！發給他一張「老師通行證 (Cookie)」
    teacherCookie.value = true;
    router.push('/teacher');
  } else {
    alert('❌ 密碼錯誤，只有老師可以進入喔！');
    teacherPassword.value = ''; // 清空輸入框
  }
};
</script>
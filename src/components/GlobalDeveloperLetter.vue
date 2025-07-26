<template>
  <!-- 全局开发者信件弹窗 -->
  <Teleport to="body">
    <div v-if="showLetter" class="global-developer-modal" @click="closeLetter">
      <div class="developer-letter-content" @click.stop>
        <button class="close-btn" @click.stop="closeLetter" @mousedown.stop @touchstart.stop>×</button>
        <div class="developer-header">
          <div class="developer-avatar">💻</div>
          <h3>来自开发者的信</h3>
          <p class="developer-subtitle">好朋友 · 前任 · 代码诗人</p>
        </div>
        <div class="developer-body">
          <div class="developer-text">
            <p class="greeting">致我最珍贵的人：</p>
            <p>当我写下这些代码的时候，脑海中浮现的都是我们一起度过的美好时光...</p>
            <p>还记得那个夏天吗？我们一起在ARK的世界里探险，你总是比我更勇敢，总是冲在最前面保护我。那时的我们，以为时间会永远停留在那个美好的瞬间。</p>
            <p>虽然我们的爱情故事有了不同的结局，但那些回忆依然是我心中最珍贵的宝藏。你教会了我什么是温柔，什么是包容，什么是无条件的关爱。</p>
            <p>现在的我们，从恋人变成了朋友，这或许是最好的安排。我依然想要守护你的笑容，依然想要在你需要的时候陪伴在你身边。</p>
            <p>这个网站的每一行代码，都承载着我对你的祝福。愿你永远快乐，永远被爱包围，永远像个被宠爱的小朋友。</p>
            <p>悟空在星空中守护着你，而我，会在现实中默默为你加油。</p>
            <p>你已经收集完了所有的时光密码：<span class="time-code">{{ timeCode }}</span></p>
            <p>这串数字代表着我们最珍贵的回忆 - 8月11日，我们在ARK相遇的日子。</p>
            <p>生日快乐，我最珍贵的朋友。</p>
            <p class="signature">用代码编织祝福的人<br>2024年7月30日 ❤️</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式状态
const showLetter = ref(false)
const timeCode = ref('811730')

// 监听全局开发者信件事件
const handleShowDeveloperLetter = (event) => {
  console.log('🎉 收到全局开发者信件显示事件:', event.detail)
  showLetter.value = true
}

// 关闭信件
const closeLetter = (event) => {
  // 阻止事件冒泡，确保点击响应
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  showLetter.value = false
  console.log('❌ 关闭全局开发者信件')
}

// 生命周期
onMounted(() => {
  window.addEventListener('showDeveloperLetter', handleShowDeveloperLetter)
  console.log('🔗 全局开发者信件监听器已注册')
})

onUnmounted(() => {
  window.removeEventListener('showDeveloperLetter', handleShowDeveloperLetter)
  console.log('🔗 全局开发者信件监听器已移除')
})
</script>

<style scoped>
.global-developer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: modalAppear 0.5s ease-out;
}

@keyframes modalAppear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.developer-letter-content {
  background: linear-gradient(135deg, #2E0854 0%, #4B0082 50%, #8A2BE2 100%);
  border: 3px solid #FFD700;
  border-radius: 25px;
  padding: 35px;
  max-width: 650px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  animation: letterSlideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  color: white;
}

@keyframes letterSlideUp {
  0% { transform: translateY(60px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);  /* 添加背景确保可见 */
  border: 2px solid #FFD700;       /* 添加边框增强可见性 */
  font-size: 28px;
  color: #FFD700;
  cursor: pointer;
  width: 45px;                     /* 增大点击区域 */
  height: 45px;                    /* 增大点击区域 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 10;                     /* 确保在最顶层 */
  user-select: none;               /* 防止文本选择 */
}

.close-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  transform: scale(1.1);
}

.developer-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #FFD700;
}

.developer-avatar {
  font-size: 50px;
  margin-bottom: 15px;
  animation: avatarGlow 3s ease-in-out infinite;
}

@keyframes avatarGlow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
  }
}

.developer-header h3 {
  margin: 0 0 8px 0;
  color: #FFD700;
  font-size: 26px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
}

.developer-subtitle {
  margin: 0;
  color: #FFC2EF;
  font-size: 14px;
  opacity: 0.9;
  font-style: italic;
}

.developer-body {
  margin-bottom: 25px;
}

.developer-text {
  color: #E6E6FA;
  font-size: 16px;
  line-height: 1.8;
}

.developer-text p {
  margin-bottom: 18px;
  animation: textAppear 1s ease-out;
}

.developer-text p:nth-child(1) { animation-delay: 0.1s; }
.developer-text p:nth-child(2) { animation-delay: 0.2s; }
.developer-text p:nth-child(3) { animation-delay: 0.3s; }
.developer-text p:nth-child(4) { animation-delay: 0.4s; }
.developer-text p:nth-child(5) { animation-delay: 0.5s; }
.developer-text p:nth-child(6) { animation-delay: 0.6s; }
.developer-text p:nth-child(7) { animation-delay: 0.7s; }
.developer-text p:nth-child(8) { animation-delay: 0.8s; }
.developer-text p:nth-child(9) { animation-delay: 0.9s; }
.developer-text p:nth-child(10) { animation-delay: 1.0s; }
.developer-text p:nth-child(11) { animation-delay: 1.1s; }

@keyframes textAppear {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

.developer-text .greeting {
  font-weight: bold;
  color: #FFD700 !important;
  font-size: 18px !important;
}

.developer-text .signature {
  text-align: right;
  font-style: italic;
  color: #FFD700 !important;
  font-weight: bold;
  margin-top: 25px !important;
}

.time-code {
  color: #FFD700;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  animation: codeGlow 2s ease-in-out infinite;
}

@keyframes codeGlow {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); }
  50% { text-shadow: 0 0 20px rgba(255, 215, 0, 1); }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .developer-letter-content {
    padding: 25px;
    margin: 15px;
  }

  .developer-text {
    font-size: 15px;
  }

  .developer-header h3 {
    font-size: 22px;
  }

  .developer-avatar {
    font-size: 40px;
  }
}
</style>

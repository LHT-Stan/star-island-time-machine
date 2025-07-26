<template>
  <div class="achievement-system">
    <!-- 成就通知弹窗 -->
    <div 
      v-if="showNotification" 
      class="achievement-notification"
      @click="closeNotification"
    >
      <div class="notification-content">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-info">
          <div class="achievement-title">成就解锁！</div>
          <div class="achievement-name">{{ currentAchievement?.title }}</div>
          <div class="achievement-desc">{{ currentAchievement?.description }}</div>
        </div>
        <div class="achievement-emoji">{{ currentAchievement?.emoji }}</div>
      </div>
      <div class="notification-progress">
        <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </div>
    
    <!-- 成就列表（可选显示） -->
    <div v-if="showList" class="achievement-list">
      <div class="list-header">
        <h3>🏆 成就收集</h3>
        <div class="progress-summary">{{ unlockedCount }}/{{ totalCount }}</div>
      </div>
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-emoji">{{ achievement.emoji }}</div>
          <div class="achievement-details">
            <div class="achievement-title">{{ achievement.title }}</div>
            <div class="achievement-desc">{{ achievement.description }}</div>
          </div>
          <div class="unlock-status">
            {{ achievement.unlocked ? '✅' : '🔒' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Props
const props = defineProps({
  showList: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['achievement-unlocked'])

// 成就数据
const achievements = ref([
  {
    id: 'dragon-hatcher',
    emoji: '🥚',
    title: '龙蛋孵化者',
    description: '成功孵化了友谊的龙蛋',
    unlocked: false
  },
  {
    id: 'memory-keeper',
    emoji: '💭',
    title: '回忆守护者',
    description: '查看了悟空的珍贵回忆',
    unlocked: false
  },
  {
    id: 'code-breaker',
    emoji: '🔓',
    title: '密码破译者',
    description: '破解了1314520摩斯密码',
    unlocked: false
  },
  {
    id: 'snack-collector',
    emoji: '🍿',
    title: '零食收集家',
    description: '收集了足够的零食解锁兑换券',
    unlocked: false
  },
  {
    id: 'scroll-reader',
    emoji: '📜',
    title: '卷轴阅读者',
    description: '展开了时光贺卡',
    unlocked: false
  },
  {
    id: 'voice-listener',
    emoji: '🎵',
    title: '语音聆听者',
    description: '解锁并聆听了语音祝福',
    unlocked: false
  }
])

// 响应式状态
const showNotification = ref(false)
const currentAchievement = ref(null)
const progressWidth = ref(0)

// 计算属性
const unlockedCount = computed(() => 
  achievements.value.filter(a => a.unlocked).length
)

const totalCount = computed(() => achievements.value.length)

// 解锁成就
const unlockAchievement = (achievementId) => {
  const achievement = achievements.value.find(a => a.id === achievementId)
  if (!achievement || achievement.unlocked) return
  
  achievement.unlocked = true
  currentAchievement.value = achievement
  showAchievementNotification()
  
  // 保存到本地存储
  saveAchievements()
  
  // 触发事件
  emit('achievement-unlocked', achievement)
}

// 显示成就通知
const showAchievementNotification = () => {
  showNotification.value = true
  progressWidth.value = 0
  
  // 进度条动画
  setTimeout(() => {
    progressWidth.value = 100
  }, 100)
  
  // 自动关闭
  setTimeout(() => {
    closeNotification()
  }, 4000)
}

// 关闭通知
const closeNotification = () => {
  showNotification.value = false
  progressWidth.value = 0
}

// 保存成就到本地存储
const saveAchievements = () => {
  const achievementData = achievements.value.map(a => ({
    id: a.id,
    unlocked: a.unlocked
  }))
  localStorage.setItem('star-island-achievements', JSON.stringify(achievementData))
}

// 从本地存储加载成就
const loadAchievements = () => {
  try {
    const saved = localStorage.getItem('star-island-achievements')
    if (saved) {
      const achievementData = JSON.parse(saved)
      achievementData.forEach(saved => {
        const achievement = achievements.value.find(a => a.id === saved.id)
        if (achievement) {
          achievement.unlocked = saved.unlocked
        }
      })
    }
  } catch (error) {
    console.log('加载成就数据失败:', error)
  }
}

// 重置所有成就
const resetAchievements = () => {
  achievements.value.forEach(a => {
    a.unlocked = false
  })
  saveAchievements()
}

// 检查成就状态
const getAchievementStatus = (achievementId) => {
  const achievement = achievements.value.find(a => a.id === achievementId)
  return achievement ? achievement.unlocked : false
}

// 暴露方法给父组件
defineExpose({
  unlockAchievement,
  resetAchievements,
  getAchievementStatus,
  achievements: computed(() => achievements.value)
})

// 组件挂载时加载数据
onMounted(() => {
  loadAchievements()
})
</script>

<style scoped>
.achievement-system {
  position: relative;
}

/* 成就通知弹窗 */
.achievement-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 3px solid #FF8C00;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
  z-index: 2000;
  cursor: pointer;
  animation: notificationSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
}

@keyframes notificationSlideIn {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 12px;
}

.achievement-icon {
  font-size: 24px;
  animation: iconSpin 2s ease-in-out infinite;
}

@keyframes iconSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

.achievement-info {
  flex: 1;
  color: #8B4513;
}

.achievement-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.achievement-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #2E0854;
}

.achievement-desc {
  font-size: 12px;
  opacity: 0.8;
}

.achievement-emoji {
  font-size: 32px;
  animation: emojiPulse 1.5s ease-in-out infinite;
}

@keyframes emojiPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.notification-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%);
  transition: width 4s linear;
}

/* 成就列表 */
.achievement-list {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #8A2BE2;
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #FFC2EF;
}

.list-header h3 {
  margin: 0;
  color: #8A2BE2;
  font-size: 18px;
}

.progress-summary {
  background: linear-gradient(135deg, #8A2BE2 0%, #FFC2EF 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
}

.achievements-grid {
  display: grid;
  gap: 10px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid transparent;
  border-radius: 10px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.achievement-item.unlocked {
  opacity: 1;
  background: rgba(255, 215, 0, 0.1);
  border-color: #FFD700;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

.achievement-item .achievement-emoji {
  font-size: 24px;
  margin-right: 12px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.achievement-item.unlocked .achievement-emoji {
  filter: grayscale(0%);
  animation: unlockedGlow 2s ease-in-out infinite;
}

@keyframes unlockedGlow {
  0%, 100% { filter: grayscale(0%) brightness(1); }
  50% { filter: grayscale(0%) brightness(1.3); }
}

.achievement-details {
  flex: 1;
}

.achievement-details .achievement-title {
  font-size: 14px;
  font-weight: bold;
  color: #2E0854;
  margin-bottom: 2px;
}

.achievement-details .achievement-desc {
  font-size: 12px;
  color: #666;
}

.unlock-status {
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .achievement-notification {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }
  
  .notification-content {
    padding: 12px;
  }
  
  .achievement-emoji {
    font-size: 24px;
  }
  
  .achievement-name {
    font-size: 14px;
  }
  
  .achievement-list {
    padding: 15px;
  }
  
  .achievement-item {
    padding: 10px;
  }
  
  .achievement-item .achievement-emoji {
    font-size: 20px;
    margin-right: 10px;
  }
}
</style>

<template>
  <div class="chapter1" :class="{ active: isActive }">
    <!-- 水晶岛虚化背景 -->
    <div class="crystal-background">
      <img :src="crystalIslandImageUrl" alt="水晶岛背景" />
      <div class="background-overlay"></div>
    </div>

    <!-- 隐藏的数字收集区域 (移到背景外，避免被遮挡) -->
    <div
      v-if="isHatched && !numberCollected"
      class="secret-crystal-area"
      @click="handleCrystalClick"
      :title="`点击次数: ${crystalClicks}/1`"
    >
      <!-- 数字8显示区域 -->
      <div v-if="isHatched && !numberCollected" class="crystal-number" :class="{ 'fully-visible': showCrystalNumber, 'faintly-visible': !showCrystalNumber }">
        <span class="number-reflection" @click="handleNumber8Click" :style="{ cursor: showCrystalNumber ? 'pointer' : 'default' }">8</span>
        <div v-if="showCrystalNumber" class="reflection-hint">神秘数字8</div>
      </div>
    </div>

    <!-- 章节标题 -->
    <div class="chapter-title">
      <h2>第一章：龙蛋启航</h2>
      <p class="chapter-subtitle">友谊的开始，相遇的回忆</p>
    </div>

    <!-- 时间标记 -->
    <div class="time-marker">
      <span class="time-text">1430天前的此刻</span>
      <div class="time-subtitle">在水晶岛的晨光中</div>
    </div>
    
    <!-- 龙蛋主体 -->
    <div class="dragon-egg-container">
      <div
        class="dragon-egg"
        :class="{
          breathing: !isHatched,
          hatching: isHatching,
          hatched: isHatched
        }"
        @click="onEggClick"
        role="button"
        :aria-label="isHatched ? '龙蛋已孵化' : '点击孵化龙蛋'"
        tabindex="0"
        @keydown.enter="onEggClick"
        @keydown.space="onEggClick"
      >
        <img :src="dragonEggImageUrl" alt="火龙蛋" />
        
        <!-- 蛋壳碎片 -->
        <div v-if="isHatching" class="egg-fragments">
          <div v-for="i in 6" :key="i" class="fragment" :style="getFragmentStyle(i)"></div>
        </div>
        
        <!-- 星尘粒子特效 -->
        <div v-if="isHatching || isHatched" class="stardust-particles">
          <div v-for="i in 12" :key="i" class="stardust" :style="getStardustStyle(i)"></div>
        </div>

        <!-- 孵化后的双人头像 -->
        <div v-if="isHatched" class="friendship-avatars">
          <div class="avatar-container">
            <div class="avatar">
              <img :src="myPhotoUrl" alt="我" />
              <div class="avatar-glow"></div>
            </div>
            <div class="friendship-heart">💖</div>
            <div class="avatar">
              <img :src="herPhotoUrl" alt="她" />
              <div class="avatar-glow"></div>
            </div>
          </div>
          <div class="friendship-quote">
            "在这片星海中，我们的友谊如龙蛋般珍贵，永远闪闪发光"
          </div>
        </div>
      </div>
    </div>
    
    <!-- 龙蛋引导提示 -->
    <div v-if="!isHatched && !isHatching" class="dragon-egg-hints">
      <div class="hint-bubble" :class="{ visible: showHints }">
        <div class="hint-text">{{ currentHint }}</div>
        <div class="hint-arrow">↓</div>
      </div>
      <!-- 添加脉动指示器 -->
      <div class="pulse-indicator"></div>
    </div>

    <!-- 水晶簇探索 -->
    <div v-if="isHatched && showCrystals" class="crystal-clusters">
      <div class="crystal-hint">💎 点击水晶簇探索回忆</div>
      <div
        v-for="(crystal, index) in crystalClusters"
        :key="index"
        class="crystal-cluster"
        :style="crystal.style"
        @click="onCrystalClick(index)"
      >
        💎
      </div>
    </div>

    <!-- 主回忆弹窗（龙蛋孵化后自动显示） -->
    <Teleport to="body">
      <div v-if="showMainMemory" class="main-memory-modal" @click="closeMainMemory">
      <div class="main-memory-card" @click.stop>
        <div class="memory-header">
          <h2>🌅 友谊的黎明</h2>
          <button class="close-btn" @click="closeMainMemory">×</button>
        </div>
        <div class="memory-story">
          <div class="story-section">
            <div class="story-icon">🏝️</div>
            <p>那是2021年8月11日的凌晨5:20，在ARK的水晶岛(48,80)坐标处...</p>
          </div>
          <div class="story-section">
            <div class="story-icon">🥚</div>
            <p>我们一起守护着这颗神秘的龙蛋，从陌生到熟悉，从相识到相知...</p>
          </div>
          <div class="story-section">
            <div class="story-icon">⭐</div>
            <p>1430个日夜过去了，友谊如这颗龙蛋一样，在时光中慢慢孵化...</p>
          </div>
          <div class="story-section">
            <div class="story-icon">💝</div>
            <p>今天，让我们一起见证这份珍贵友谊的绽放！</p>
          </div>
        </div>
        <div class="memory-footer">
          <button @click="closeMainMemory" class="continue-btn">继续我们的故事 →</button>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- 水晶簇回忆卡片弹窗 -->
    <Teleport to="body">
      <div v-if="showMemoryCard" class="memory-card-modal" @click="closeMemoryCard">
      <div class="memory-card" @click.stop>
        <button class="close-btn" @click="closeMemoryCard">×</button>
        <div class="memory-content">
          <div class="memory-header">
            <h3>{{ currentMemory.title }}</h3>
            <div class="memory-icon">{{ currentMemory.icon }}</div>
          </div>
          <div class="memory-details">
            <p><strong>相遇坐标：</strong>{{ currentMemory.location }}</p>
            <p><strong>相遇时间：</strong>{{ currentMemory.time }}</p>
            <p><strong>时光计算：</strong>{{ currentMemory.duration }}</p>
          </div>
          <div class="memory-message">
            {{ currentMemory.message }}
          </div>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- 时间卡片 -->
    <div class="time-card">
      <div class="time-card-content">
        <div class="time-title">我们已经认识了</div>
        <div class="time-display">
          <span class="time-number">{{ friendshipDuration.days }}</span>天
          <span class="time-number">{{ friendshipDuration.hours }}</span>时
          <span class="time-number">{{ friendshipDuration.minutes }}</span>分
          <span class="time-number">{{ friendshipDuration.seconds }}</span>秒
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div v-if="isHatched" class="navigation-button">
      <button
        @click="goToNextChapter"
        class="next-chapter-btn"
        aria-label="前往第二章：悟空的星光海"
        :disabled="isNavigating"
      >
        <span class="btn-text">下一章</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>

    <!-- 成就解锁提示 -->
    <Teleport to="body">
      <div v-if="showAchievement" class="achievement-popup">
      <div class="achievement-content">
        <div class="achievement-icon">🥚</div>
        <div class="achievement-text">
          <div class="achievement-title">成就解锁：龙蛋孵化者</div>
          <div class="achievement-desc">成功孵化了友谊的龙蛋</div>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, Teleport } from 'vue'
import numberCollector from '../utils/numberCollector.js'
import { flatImageUrls } from '../config/images.js'

// Props
const props = defineProps({
  isActive: Boolean
})

// 图片资源
const crystalIslandImageUrl = flatImageUrls.crystalIslandImageUrl
const dragonEggImageUrl = flatImageUrls.dragonEggImageUrl
const myPhotoUrl = flatImageUrls.photoWallMe
const herPhotoUrl = flatImageUrls.photoWallFeier1

// Emits
const emit = defineEmits(['chapter-complete', 'next-chapter'])

// 响应式状态
const isHatching = ref(false)
const isHatched = ref(false)
const showHints = ref(false)
const showCrystals = ref(false)
const showMemoryCard = ref(false)
const showMainMemory = ref(false)
const showAchievement = ref(false)
const currentHintIndex = ref(0)
const currentMemory = ref({})

// 数字收集彩蛋系统
const crystalClicks = ref(0)
const showCrystalNumber = ref(false)
const numberCollected = ref(false)

// 友谊时间计算
const friendshipStartTime = new Date('2021-08-11T05:20:00')
const friendshipDuration = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

// 引导提示文案
const hints = [
  "点击我来孵化友谊的龙蛋吧！🥚✨",
  "在这里，我们的故事即将开始~ 🌟💫",
  "轻轻一点，见证奇迹的诞生！🐣💝"
]

// 水晶簇数据
const crystalClusters = ref([
  { style: { top: '20%', left: '15%' } },
  { style: { top: '30%', right: '20%' } },
  { style: { top: '60%', left: '25%' } },
  { style: { top: '70%', right: '15%' } }
])

// 回忆数据
const memories = [
  {
    title: "初次相遇",
    icon: "🌅",
    location: "ARK水晶岛 (48,80)",
    time: "2021年8月11日 凌晨5:20",
    duration: "1430天前的美好时光",
    message: "那个清晨，我们在虚拟世界中相遇，从此开始了这段珍贵的友谊..."
  },
  {
    title: "龙蛋守护",
    icon: "🥚",
    location: "水晶洞穴深处",
    time: "黎明时分",
    duration: "友谊的见证",
    message: "我们一起守护着这颗龙蛋，就像守护着彼此的友谊..."
  },
  {
    title: "星光约定",
    icon: "⭐",
    location: "星空之下",
    time: "每个夜晚",
    duration: "永恒的承诺",
    message: "无论距离多远，我们都会是彼此可以信任的好朋友..."
  },
  {
    title: "时光见证",
    icon: "⏰",
    location: "回忆长河",
    time: "此时此刻",
    duration: "1430个日夜",
    message: "时光荏苒，友谊如初，愿我们的故事永远续写下去..."
  }
]

// 计算属性
const currentHint = computed(() => hints[currentHintIndex.value])

// 龙蛋点击处理 - 核心交互逻辑
const onEggClick = () => {
  if (isHatched.value || isHatching.value) return

  // 播放点击音效
  playSound('egg-click')

  // 隐藏提示
  showHints.value = false

  // 开始孵化动画
  isHatching.value = true

  // 播放破裂音效
  setTimeout(() => {
    playSound('egg-crack')
  }, 500)

  // 2.5秒后完成孵化
  setTimeout(() => {
    isHatching.value = false
    isHatched.value = true

    // 播放孵化成功音效
    playSound('hatch-success')

    // 显示成就
    showAchievementPopup()

    // 播放成就音效
    setTimeout(() => {
      playSound('achievement')
    }, 500)

    // 1秒后显示主回忆弹窗
    setTimeout(() => {
      showMainMemory.value = true
    }, 1000)

    // 3秒后显示水晶簇（如果用户没有关闭回忆弹窗）
    setTimeout(() => {
      if (!showMainMemory.value) {
        showCrystals.value = true
      }
    }, 3000)

    // 通知父组件章节完成
    emit('chapter-complete', 1)
  }, 2500)
}

// 水晶簇点击处理
const onCrystalClick = (index) => {
  // 播放水晶点击音效
  playSound('crystal-click')

  currentMemory.value = memories[index]
  showMemoryCard.value = true
}

// 关闭主回忆弹窗
const closeMainMemory = () => {
  showMainMemory.value = false
  // 关闭后显示水晶簇
  setTimeout(() => {
    showCrystals.value = true
  }, 500)
}

// 关闭水晶簇回忆卡片
const closeMemoryCard = () => {
  showMemoryCard.value = false
}

// 导航到下一章（发射事件给父组件）
const isNavigating = ref(false)

const goToNextChapter = () => {
  if (isNavigating.value) return

  isNavigating.value = true

  try {
    // 发射事件给父组件进行章节切换
    emit('next-chapter')
  } catch (error) {
    console.log('导航错误:', error)
  }

  // 重置导航状态
  setTimeout(() => {
    isNavigating.value = false
  }, 500)
}

// 更新友谊时间（带错误处理）
const updateFriendshipTime = () => {
  try {
    const now = new Date()
    const diff = now - friendshipStartTime

    // 确保时间差为正数
    if (diff < 0) {
      friendshipDuration.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    // 验证计算结果
    if (days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0) {
      friendshipDuration.value = { days, hours, minutes, seconds }
    }
  } catch (error) {
    console.log('时间计算错误:', error)
    // 设置默认值
    friendshipDuration.value = { days: 1430, hours: 0, minutes: 0, seconds: 0 }
  }
}

// 显示成就弹窗
const showAchievementPopup = () => {
  showAchievement.value = true
  setTimeout(() => {
    showAchievement.value = false
  }, 3000)
}

// 水晶点击处理 - 数字收集彩蛋
const handleCrystalClick = () => {
  if (numberCollected.value || !isHatched.value) return

  crystalClicks.value++
  console.log(`💎 水晶点击次数: ${crystalClicks.value}/1`)

  // 播放水晶点击音效
  playSound('crystal-click')

  if (crystalClicks.value === 1) {
    // 显示数字8
    showCrystalNumber.value = true
    console.log('✨ 水晶反射中出现了数字8!')
    console.log('showCrystalNumber状态:', showCrystalNumber.value)

    // 立即显示提示
    showGlobalHint('水晶反射中出现了神秘数字！点击数字8收集它！')
  }
}

// 全局提示显示
const showGlobalHint = (message) => {
  const hintElement = document.createElement('div')
  hintElement.className = 'global-number-hint'
  hintElement.textContent = message
  hintElement.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #8B4513;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: bold;
    font-size: 16px;
    box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
    z-index: 9999;
    animation: hintFadeInOut 4s ease-in-out forwards;
  `

  // 添加动画样式
  const style = document.createElement('style')
  style.textContent = `
    @keyframes hintFadeInOut {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(hintElement)

  setTimeout(() => {
    hintElement.remove()
    style.remove()
  }, 4000)
}

// 数字8直接点击处理
const handleNumber8Click = () => {
  if (!showCrystalNumber.value || numberCollected.value) return

  console.log('🔢 直接点击数字8')
  const success = numberCollector.collectNumber(1, 8, 'crystal_reflection')
  if (success) {
    numberCollected.value = true
    showCrystalNumber.value = false
    console.log('🎉 成功收集数字8!')

    // 显示收集成功提示
    showGlobalHint('一个神秘的数字，似乎代表了什么意义。')
  }
}



// 音效播放函数
const playSound = (soundType) => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    switch (soundType) {
      case 'egg-click':
        // 龙蛋点击音效 - 轻柔的敲击声
        playEggClickSound(audioContext)
        break
      case 'egg-crack':
        // 龙蛋破裂音效 - 清脆的破裂声
        playEggCrackSound(audioContext)
        break
      case 'hatch-success':
        // 孵化成功音效 - 欢快的和弦
        playHatchSuccessSound(audioContext)
        break
      case 'crystal-click':
        // 水晶点击音效 - 清脆的铃声
        playCrystalClickSound(audioContext)
        break
      case 'achievement':
        // 成就解锁音效 - 胜利的音调
        playAchievementSound(audioContext)
        break
      default:
        console.log(`未知音效类型: ${soundType}`)
    }
  } catch (error) {
    console.log(`音效播放失败 (${soundType}):`, error)
  }
}

// 龙蛋点击音效
const playEggClickSound = (audioContext) => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2)

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.2)
}

// 龙蛋破裂音效
const playEggCrackSound = (audioContext) => {
  // 多个快速的破裂声
  const frequencies = [800, 600, 400, 300]

  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.15)
    }, index * 50)
  })
}

// 孵化成功音效
const playHatchSuccessSound = (audioContext) => {
  const frequencies = [523, 659, 784, 1047] // C-E-G-C上升音阶

  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.8)
    }, index * 200)
  })
}

// 水晶点击音效
const playCrystalClickSound = (audioContext) => {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(1800, audioContext.currentTime + 0.3)

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.3)
}

// 成就解锁音效
const playAchievementSound = (audioContext) => {
  const frequencies = [523, 659, 784, 1047, 1319] // 胜利音阶

  frequencies.forEach((freq, index) => {
    setTimeout(() => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    }, index * 150)
  })
}

// 启动提示循环
const startHintCycle = () => {
  showHints.value = true

  setInterval(() => {
    if (!isHatched.value && !isHatching.value) {
      currentHintIndex.value = (currentHintIndex.value + 1) % hints.length
    }
  }, 3000)
}

// 启动时间更新定时器
let timeUpdateInterval = null
const startTimeUpdate = () => {
  updateFriendshipTime() // 立即更新一次
  timeUpdateInterval = setInterval(updateFriendshipTime, 1000) // 每秒更新
}

// 碎片样式计算 - 6片蛋壳的飞出动画
const getFragmentStyle = (index) => {
  const angles = [0, 60, 120, 180, 240, 300] // 6个方向
  const angle = angles[index - 1]
  const distance = 150 // 飞出距离

  return {
    '--angle': `${angle}deg`,
    '--distance': `${distance}px`,
    animationDelay: `${index * 0.1}s`
  }
}

// 星尘粒子样式计算
const getStardustStyle = (index) => {
  const angle = (index * 30) % 360 // 每30度一个粒子
  const distance = 80 + Math.random() * 40 // 随机距离
  const delay = Math.random() * 2 // 随机延迟

  return {
    '--particle-angle': `${angle}deg`,
    '--particle-distance': `${distance}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${2 + Math.random()}s`
  }
}

// 监听章节激活状态
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    // 延迟1秒后开始提示
    setTimeout(() => {
      startHintCycle()
    }, 1000)
  }
})

// 组件挂载时的初始化
onMounted(() => {
  console.log('第一章：龙蛋启航 已加载')

  // 启动时间更新
  startTimeUpdate()

  // 如果章节已激活，立即开始提示
  if (props.isActive) {
    setTimeout(() => {
      startHintCycle()
    }, 1000)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval)
  }
})
</script>

<style scoped>
.chapter1 {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.5s ease;
}

.chapter1.active {
  opacity: 1;
}

/* 水晶岛虚化背景 */
.crystal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.crystal-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(3px) brightness(0.7) saturate(1.2);
  transform: scale(1.1) translateZ(0);
  animation: backgroundFloat 20s ease-in-out infinite;
  will-change: transform;
  backface-visibility: hidden;
}

@keyframes backgroundFloat {
  0%, 100% { transform: scale(1.1) translateY(0); }
  50% { transform: scale(1.15) translateY(-10px); }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(46, 8, 84, 0.6) 0%,
    rgba(138, 43, 226, 0.4) 50%,
    rgba(255, 194, 239, 0.3) 100%
  );
  z-index: 1;  /* 确保背景层级最低 */
}

/* 隐藏的数字收集区域 */
.secret-crystal-area {
  position: absolute;
  top: 85%;
  right: 0%;
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 100;  /* 提高z-index确保在最顶层 */
  pointer-events: auto;  /* 确保可以点击 */
  animation: crystalPulse 3s ease-in-out infinite;  /* 添加脉动动画 */
}


/* 水晶区域脉动动画 */
@keyframes crystalPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

/* 水晶反射数字 */
.crystal-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 101;  /* 确保在水晶区域之上 */
  transition: all 0.5s ease;
  pointer-events: auto;  /* 确保可以点击 */
}

.crystal-number .number-reflection {
  pointer-events: auto;  /* 允许数字被点击 */
  cursor: pointer;
}

/* 若隐若现状态 */
.crystal-number.faintly-visible {
  opacity: 0.15;  /* 微弱可见 */
  animation: faintPulse 4s ease-in-out infinite;
}

/* 完全可见状态 */
.crystal-number.fully-visible {
  opacity: 1;
  animation: numberAppear 5s ease-in-out;
}

@keyframes faintPulse {
  0%, 100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(1);
  }
}







.number-reflection {
  display: block;
  font-size: 25px;
  font-weight: 900;
  color: #FFD700;
  transition: all 0.5s ease;
}



.reflection-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #FFF;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  opacity: 0.8;
}

@keyframes numberAppear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes numberGlow {
  0%, 100% {
    text-shadow:
      0 0 10px #FFD700,
      0 0 20px #FFD700,
      0 0 30px #FFD700;
  }
  50% {
    text-shadow:
      0 0 15px #FFD700,
      0 0 30px #FFD700,
      0 0 45px #FFD700,
      0 0 60px #FFD700;
  }
}

/* 章节标题 */
.chapter-title {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.chapter-title h2 {
  color: #FFC2EF;
  font-size: 24px;
  margin: 0 0 5px 0;
  text-shadow: 0 0 15px rgba(255, 194, 239, 0.8);
  animation: titleGlow 3s ease-in-out infinite;
}

.chapter-subtitle {
  color: #E6E6FA;
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 15px rgba(255, 194, 239, 0.8); }
  50% { text-shadow: 0 0 25px rgba(255, 194, 239, 1); }
}

.crystal-island {
  position: absolute;
  top: 48px;
  left: 80px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.crystal-island:hover {
  transform: scale(1.1);
}

.crystal-island img {
  width: 120px;
  height: auto;
  filter: brightness(1) saturate(1);
  transition: filter 0.3s ease;
}

.time-marker {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 5;
}

.time-text {
  color: #FFC2EF;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(255, 194, 239, 0.8);
  display: block;
  margin-bottom: 5px;
}

.time-subtitle {
  color: #E6E6FA;
  font-size: 14px;
  opacity: 0.8;
}

/* 时间卡片 */
.time-card {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.time-card-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 194, 239, 0.8) 100%);
  border: 2px solid #8A2BE2;
  border-radius: 20px;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(10px);
  animation: cardPulse 3s ease-in-out infinite;
}

@keyframes cardPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 12px 35px rgba(138, 43, 226, 0.4); }
}

.time-title {
  color: #2E0854;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.time-display {
  color: #8A2BE2;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time-number {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #2E0854;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 16px;
  min-width: 30px;
  display: inline-block;
  text-align: center;
  animation: numberGlow 2s ease-in-out infinite;
}

@keyframes numberGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.8); }
}

/* 导航按钮 */
.navigation-button {
  position: absolute;
  bottom: 120px;
  right: 30px;
  z-index: 10;
}

.next-chapter-btn {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  transition: all 0.3s ease;
  animation: btnFloat 3s ease-in-out infinite;
}

@keyframes btnFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.next-chapter-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

.btn-arrow {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.next-chapter-btn:hover .btn-arrow {
  transform: translateX(3px);
}

.next-chapter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.next-chapter-btn:disabled:hover {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
}

.dragon-egg-container {
  position: relative;
  z-index: 2;
}

.dragon-egg {
  width: 200px;
  height: 200px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, filter;
  transform: translateZ(0);
}

.dragon-egg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 呼吸动画 - 核心视觉效果 */
.dragon-egg.breathing {
  animation: breathing 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes breathing {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1) drop-shadow(0 0 20px rgba(255, 140, 0, 0.6)) hue-rotate(0deg);
  }
  25% {
    transform: scale(1.02);
    filter: brightness(1.1) drop-shadow(0 0 25px rgba(255, 140, 0, 0.7)) hue-rotate(10deg);
  }
  50% {
    transform: scale(1.08);
    filter: brightness(1.3) drop-shadow(0 0 35px rgba(255, 140, 0, 1)) hue-rotate(20deg);
  }
  75% {
    transform: scale(1.02);
    filter: brightness(1.1) drop-shadow(0 0 25px rgba(255, 140, 0, 0.7)) hue-rotate(10deg);
  }
}

/* 孵化动画 */
.dragon-egg.hatching {
  animation: hatching 2.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes hatching {
  0% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) drop-shadow(0 0 20px rgba(255, 140, 0, 0.6));
  }
  15% {
    transform: scale(1.05) rotate(3deg);
    filter: brightness(1.2) drop-shadow(0 0 30px rgba(255, 140, 0, 0.8));
  }
  30% {
    transform: scale(1.15) rotate(-8deg);
    filter: brightness(1.4) drop-shadow(0 0 40px rgba(255, 140, 0, 1));
  }
  45% {
    transform: scale(1.25) rotate(12deg);
    filter: brightness(1.6) drop-shadow(0 0 50px rgba(255, 140, 0, 1.2));
  }
  60% {
    transform: scale(1.3) rotate(-15deg);
    filter: brightness(1.8) drop-shadow(0 0 60px rgba(255, 140, 0, 1.4));
  }
  75% {
    transform: scale(1.2) rotate(8deg);
    filter: brightness(1.5) drop-shadow(0 0 45px rgba(255, 140, 0, 1.1));
  }
  90% {
    transform: scale(1.1) rotate(-3deg);
    filter: brightness(1.3) drop-shadow(0 0 35px rgba(255, 140, 0, 0.9));
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: brightness(1) drop-shadow(0 0 20px rgba(255, 140, 0, 0.6));
  }
}

/* 蛋壳碎片动画 */
.egg-fragments {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.fragment {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, #8B4513 0%, #A0522D 100%);
  border-radius: 50% 20% 50% 20%;
  animation: fragmentFly 1.5s ease-out forwards;
}

@keyframes fragmentFly {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%)
               translateX(calc(cos(var(--angle, 0deg)) * var(--distance, 150px)))
               translateY(calc(sin(var(--angle, 0deg)) * var(--distance, 150px)))
               rotate(720deg);
    opacity: 0;
  }
}

/* 星尘粒子特效 */
.stardust-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.stardust {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 100%);
  border-radius: 50%;
  animation: stardustFloat 3s ease-out infinite;
}

@keyframes stardustFloat {
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%)
               translateX(calc(cos(var(--particle-angle, 0deg)) * var(--particle-distance, 80px)))
               translateY(calc(sin(var(--particle-angle, 0deg)) * var(--particle-distance, 80px)))
               scale(1) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%)
               translateX(calc(cos(var(--particle-angle, 0deg)) * calc(var(--particle-distance, 80px) * 1.5)))
               translateY(calc(sin(var(--particle-angle, 0deg)) * calc(var(--particle-distance, 80px) * 1.5)))
               scale(0) rotate(360deg);
    opacity: 0;
  }
}

/* 龙蛋引导提示 */
.dragon-egg-hints {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.hint-bubble {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 194, 239, 0.9) 100%);
  border: 2px solid #8A2BE2;
  border-radius: 20px;
  padding: 12px 16px;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.5s ease;
  position: relative;
  max-width: 280px;
  text-align: center;
}

.hint-bubble.visible {
  opacity: 1;
  transform: translateY(0);
}

.hint-text {
  color: #2E0854;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
}

.hint-arrow {
  color: #8A2BE2;
  font-size: 16px;
  animation: arrowBounce 1.5s ease-in-out infinite;
}

@keyframes arrowBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

/* 脉动指示器 */
.pulse-indicator {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.6);
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.6;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  }
  50% {
    transform: translateX(-50%) scale(1.5);
    opacity: 0.9;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.9);
  }
}

.hint-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #8A2BE2;
}

/* 友谊头像 */
.friendship-avatars {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: contentAppear 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  animation: avatarGlow 3s ease-in-out infinite;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1) saturate(1.15);
}

.avatar-glow {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
  z-index: -1;
  animation: glowRotate 4s linear infinite;
}

@keyframes avatarGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
    transform: scale(1.05);
  }
}

@keyframes glowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.friendship-heart {
  font-size: 32px;
  animation: heartBeat 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 20, 147, 0.8));
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1.2); }
  75% { transform: scale(1.1); }
}

.friendship-quote {
  color: #2E0854;
  font-size: 16px;
  font-style: italic;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 194, 239, 0.8) 100%);
  padding: 15px 20px;
  border-radius: 20px;
  border: 2px solid #8A2BE2;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(10px);
  max-width: 350px;
  line-height: 1.5;
}

@keyframes contentAppear {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.avatars {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  justify-content: center;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #FFC2EF;
  box-shadow: 0 0 15px rgba(255, 194, 239, 0.6);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dialogue-bubble {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 20px;
  color: #2E0854;
  font-size: 14px;
  line-height: 1.4;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

.dialogue-bubble::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border: 10px solid transparent;
  border-bottom-color: rgba(255, 255, 255, 0.9);
}

.hint-text {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  color: #FFC2EF;
  font-size: 16px;
  text-shadow: 0 0 8px rgba(255, 194, 239, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 水晶簇探索 */
.crystal-clusters {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 容器本身不可点击，避免遮挡其他按钮 */
  z-index: 15; /* 确保在合适的层级 */
}

.crystal-hint {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  color: #FFD700;
  font-size: 16px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  animation: hintPulse 2s ease-in-out infinite;
  pointer-events: none;
}

.crystal-cluster {
  position: absolute;
  font-size: 24px;
  cursor: pointer;
  pointer-events: auto !important; /* 强制启用点击事件 */
  animation: crystalFloat 3s ease-in-out infinite;
  transition: all 0.3s ease;
  z-index: 20; /* 确保在最顶层 */
}

.crystal-cluster:hover {
  transform: scale(1.3);
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.9));
}

@keyframes crystalFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(10deg); }
}

/* 主回忆弹窗 */
.main-memory-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: modalFadeIn 0.5s ease-out;
}

.main-memory-card {
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  border: 3px solid #DAA520;
  border-radius: 25px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  animation: cardSlideUp 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.main-memory-card .memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #DAA520;
}

.main-memory-card .memory-header h2 {
  margin: 0;
  color: #8B4513;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
}

.memory-story {
  margin-bottom: 25px;
}

.story-section {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border-left: 4px solid #8A2BE2;
  animation: storyAppear 0.8s ease-out;
}

.story-section:nth-child(1) { animation-delay: 0.2s; }
.story-section:nth-child(2) { animation-delay: 0.4s; }
.story-section:nth-child(3) { animation-delay: 0.6s; }
.story-section:nth-child(4) { animation-delay: 0.8s; }

@keyframes storyAppear {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.story-icon {
  font-size: 24px;
  flex-shrink: 0;
  animation: iconBounce 2s ease-in-out infinite;
}

.story-section p {
  margin: 0;
  color: #2E0854;
  font-size: 15px;
  line-height: 1.6;
}

.memory-footer {
  text-align: center;
}

.continue-btn {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  transition: all 0.3s ease;
}

.continue-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

/* 水晶簇回忆卡片弹窗 */
.memory-card-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.memory-card {
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  border: 3px solid #DAA520;
  border-radius: 20px;
  padding: 25px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  animation: cardSlideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

@keyframes cardSlideUp {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #8B4513;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #A0522D;
  transform: scale(1.1);
}

.memory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #DAA520;
}

.memory-header h3 {
  margin: 0;
  color: #8B4513;
  font-size: 18px;
}

.memory-icon {
  font-size: 24px;
}

.memory-details {
  margin-bottom: 15px;
  color: #8B4513;
  font-size: 14px;
}

.memory-details p {
  margin: 5px 0;
}

.memory-message {
  color: #2E0854;
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
  background: rgba(255, 255, 255, 0.5);
  padding: 12px;
  border-radius: 10px;
  border-left: 4px solid #8A2BE2;
}

/* 成就弹窗 */
.achievement-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 3px solid #FF8C00;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 10px 30px rgba(255, 140, 0, 0.4);
  z-index: 2000;
  animation: achievementSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes achievementSlideIn {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.achievement-icon {
  font-size: 24px;
  animation: achievementSpin 2s ease-in-out infinite;
}

@keyframes achievementSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

.achievement-text {
  color: #8B4513;
}

.achievement-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  opacity: 0.8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chapter-title h2 {
    font-size: 20px;
  }

  .chapter-subtitle {
    font-size: 12px;
  }

  .crystal-island {
    top: 30px;
    left: 30px;
  }

  .crystal-island img {
    width: 80px;
  }

  .dragon-egg {
    width: 150px;
    height: 150px;
  }

  .time-text {
    font-size: 14px;
  }

  .time-subtitle {
    font-size: 12px;
  }

  .hint-bubble {
    max-width: 240px;
    padding: 10px 14px;
  }

  .hint-text {
    font-size: 13px;
  }

  .crystal-cluster {
    font-size: 20px;
  }

  .memory-card {
    padding: 20px;
    margin: 20px;
  }

  .achievement-popup {
    right: 10px;
    left: 10px;
    padding: 12px;
  }
}
</style>

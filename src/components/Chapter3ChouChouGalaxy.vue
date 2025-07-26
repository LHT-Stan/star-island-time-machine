<template>
  <div class="chapter chapter-3" :class="{ active: isActive }">
    <!-- 章节标题 -->
    <div class="chapter-title">
      <h2>第三章：臭臭的零食银河</h2>
      <p class="chapter-subtitle">温柔的守护，无尽的宠爱</p>
    </div>

    <!-- 背景星空系统 -->
    <div class="galaxy-background">
      <!-- 渐变背景 -->
      <div class="gradient-overlay"></div>
      
      <!-- 背景星星 -->
      <div class="background-stars">
        <div 
          v-for="i in 30" 
          :key="i" 
          class="bg-star"
          :style="getBackgroundStarStyle(i)"
        >
          ✨
        </div>
      </div>
      
      <!-- 零食云朵 -->
      <div class="snack-clouds">
        <div
          v-for="(snack, index) in snackClouds"
          :key="index"
          class="snack-cloud"
          :class="{
            collected: snack.collected,
            [snack.rarity]: true
          }"
          :style="snack.style"
          @click="onSnackCloudClick(index)"
        >
          <div class="cloud-base">☁️</div>
          <div class="snack-item">{{ snack.emoji }}</div>
          <div class="rarity-glow" :class="snack.rarity"></div>
          <div v-if="snack.collected" class="collected-mark">✓</div>
        </div>
      </div>
    </div>

    <!-- 臭臭猫咪 -->
    <div class="chouchou-container">
      <!-- 保护光环 -->
      <div class="protection-aura" :class="{ active: showProtectionAura }">
        <div class="aura-ring ring-1"></div>
        <div class="aura-ring ring-2"></div>
        <div class="aura-ring ring-3"></div>
      </div>
      
      <!-- 臭臭本体 -->
      <div 
        class="chouchou-sprite"
        :class="{ 
          happy: chouChouState.mood === 'happy',
          scared: chouChouState.mood === 'scared',
          sleepy: chouChouState.mood === 'sleepy'
        }"
        @mouseenter="onChouChouHover"
        @mouseleave="onChouChouLeave"
        @click="onChouChouClick"
        role="button"
        aria-label="臭臭猫咪"
        tabindex="0"
        @keydown.enter="onChouChouClick"
        @keydown.space="onChouChouClick"
      >
        <img src="/images/dog.jpg" alt="臭臭" />
        
        <!-- 心情指示器 -->
        <div class="mood-indicator">
          <span v-if="chouChouState.mood === 'happy'">😸</span>
          <span v-else-if="chouChouState.mood === 'scared'">😿</span>
          <span v-else-if="chouChouState.mood === 'sleepy'">😴</span>
          <span v-else>😺</span>
        </div>
      </div>
      
      <!-- 舒适度指标 -->
      <div class="comfort-indicators">
        <div class="indicator comfort">
          <span class="icon">💝</span>
          <div class="bar">
            <div class="fill" :style="{ width: chouChouState.comfort + '%' }"></div>
          </div>
          <span class="value">{{ chouChouState.comfort }}%</span>
        </div>
        
        <div class="indicator trust">
          <span class="icon">🤝</span>
          <div class="bar">
            <div class="fill" :style="{ width: chouChouState.trust + '%' }"></div>
          </div>
          <span class="value">{{ chouChouState.trust }}%</span>
        </div>
        
        <div class="indicator hunger">
          <span class="icon">🍽️</span>
          <div class="bar">
            <div class="fill" :style="{ width: (100 - chouChouState.hunger) + '%' }"></div>
          </div>
          <span class="value">{{ 100 - chouChouState.hunger }}%</span>
        </div>
      </div>
    </div>

    <!-- 收集进度显示 -->
    <div class="collection-progress">
      <div class="progress-header">
        <span class="collection-icon">🍽️</span>
        <span class="progress-text">零食收集进度</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: collectionProgress + '%' }"></div>
      </div>
      <div class="progress-stats">
        <span class="collected-count">{{ collectedCount }}/{{ snackClouds.length }}</span>
        <span class="progress-percentage">{{ Math.round(collectionProgress) }}%</span>
      </div>
    </div>

    <!-- 成就提示 -->
    <div v-if="showAchievement" class="achievement-notification">
      <div class="achievement-content">
        <div class="achievement-icon">🏆</div>
        <h4>{{ currentAchievement.title }}</h4>
        <p>{{ currentAchievement.description }}</p>
      </div>
    </div>

    <!-- 操作反馈提示 -->
    <div v-if="showActionFeedback" class="action-feedback">
      <div class="feedback-content">
        <div class="feedback-icon">{{ actionFeedback.icon }}</div>
        <p>{{ actionFeedback.message }}</p>
      </div>
    </div>

    <!-- 互动操作面板 -->
    <div class="interaction-panel">
      <div class="panel-header">
        <span class="panel-icon">🎮</span>
        <span class="panel-title">互动操作</span>
      </div>
      <div class="action-buttons">
        <button @click="petChouChou" class="action-btn pet-btn" :disabled="petCooldown > 0">
          <span class="btn-icon">🤲</span>
          <span class="btn-text">轻抚臭臭</span>
          <span v-if="petCooldown > 0" class="cooldown">{{ petCooldown }}s</span>
        </button>

        <button @click="playwithChouChou" class="action-btn play-btn" :disabled="playCooldown > 0">
          <span class="btn-icon">🎾</span>
          <span class="btn-text">陪它玩耍</span>
          <span v-if="playCooldown > 0" class="cooldown">{{ playCooldown }}s</span>
        </button>

        <button @click="singToChouChou" class="action-btn sing-btn" :disabled="singCooldown > 0">
          <span class="btn-icon">🎵</span>
          <span class="btn-text">唱摇篮曲</span>
          <span v-if="singCooldown > 0" class="cooldown">{{ singCooldown }}s</span>
        </button>

        <button @click="cleanEnvironment" class="action-btn clean-btn" :disabled="cleanCooldown > 0">
          <span class="btn-icon">✨</span>
          <span class="btn-text">整理环境</span>
          <span v-if="cleanCooldown > 0" class="cooldown">{{ cleanCooldown }}s</span>
        </button>
      </div>
    </div>

    <!-- 数字7显示区域 -->
    <div v-if="showNumber7 && !number7Collected"
         class="number-display number-7"
         @click="handleNumber7Click">
      <span class="number-reflection">7</span>
    </div>

    <!-- 温柔提示 -->
    <div v-if="showGentleHint" class="gentle-hint">
      <div class="hint-content">
        <button @click.stop="closeGentleHint"
                class="hint-close-btn"
                aria-label="关闭提示"
                title="关闭提示"
                tabindex="0"
                @keydown.enter.stop="closeGentleHint"
                @keydown.space.stop="closeGentleHint">×</button>
        <span class="hint-icon">🤲</span>
        <p>为臭臭收集周围的美味零食，使用互动操作让它更开心</p>
        <div class="hint-tips">
          <span class="tip common">⚪ 普通</span>
          <span class="tip rare">🔵 稀有</span>
          <span class="tip epic">🟣 史诗</span>
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div v-if="showNavigationButton" class="navigation-button">
      <button 
        @click="goToNextChapter" 
        class="next-chapter-btn"
        aria-label="前往第四章"
        :disabled="isNavigating"
      >
        <span class="btn-text">下一章</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import numberCollector from '../utils/numberCollector.js'

// Props
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['chapter-complete'])

// 响应式状态
const showProtectionAura = ref(false)
const showGentleHint = ref(true)
const showNavigationButton = ref(false)
const showAchievement = ref(false)
const showActionFeedback = ref(false)
const isNavigating = ref(false)
const currentAchievement = ref({})
const actionFeedback = ref({})
const collectedSnacks = ref([])

// 互动操作冷却时间
const petCooldown = ref(0)
const playCooldown = ref(0)
const singCooldown = ref(0)
const cleanCooldown = ref(0)

// 臭臭的状态
const chouChouState = reactive({
  comfort: 80,           // 舒适度
  hunger: 30,            // 饥饿度
  trust: 20,             // 信任度
  mood: 'neutral',       // 心情状态
  position: { x: 50, y: 50 }, // 位置百分比
  isHovered: false       // 是否被悬停
})

// 零食云朵数据 - 围绕臭臭的圆形布局
// 找到这个数组定义（约第246行）
const snackClouds = reactive([
  // 将以下坐标替换为新的优化坐标
  
  // 1. 温牛奶 - 正上方优化
  { emoji: '🥛', style: { top: '25%', left: '50%', animationDelay: '0s' }, name: '温牛奶', collected: false, rarity: 'common' },
  
  // 2. 小鱼干 - 左上方安全区域
  { emoji: '🐟', style: { top: '30%', left: '32%', animationDelay: '1s' }, name: '小鱼干', collected: false, rarity: 'common' },
  
  // 3. 猫咪饼干 - 正右方
  { emoji: '🍪', style: { top: '50%', left: '75%', animationDelay: '2s' }, name: '猫咪饼干', collected: false, rarity: 'common' },
  
  // 4. 肉肉条 - 右下方安全区域
  { emoji: '🥩', style: { top: '80%', left: '90%', animationDelay: '3s' }, name: '肉肉条', collected: false, rarity: 'rare' },
  
  // 5. 奶酪块 - 正下方
  { emoji: '🧀', style: { top: '65%', left: '75%', animationDelay: '4s' }, name: '奶酪块', collected: false, rarity: 'common' },
  
  // 6. 小虾仁 - 左下方安全区域
  { emoji: '🍤', style: { top: '70%', left: '14%', animationDelay: '5s' }, name: '小虾仁', collected: false, rarity: 'rare' },
  
  // 7. 甜甜圈 - 正左方安全区域
  { emoji: '🥯', style: { top: '50%', left: '25%', animationDelay: '6s' }, name: '甜甜圈', collected: false, rarity: 'common' },
  
  // 8. 蜂蜜 - 右上方（史诗零食）
  { emoji: '🍯', style: { top: '30%', left: '68%', animationDelay: '7s' }, name: '蜂蜜', collected: false, rarity: 'epic' },
  
  // 9. 椒盐卷饼 - 右上内圈
  { emoji: '🥨', style: { top: '40%', left: '62%', animationDelay: '8s' }, name: '椒盐卷饼', collected: false, rarity: 'common' },
  
  // 10. 烤肉 - 左下内圈（史诗零食）
  { emoji: '🍖', style: { top: '60%', left: '15%', animationDelay: '9s' }, name: '烤肉', collected: false, rarity: 'epic' }
])

// 数字收集系统 - 第三章数字7
const showNumber7 = ref(false)
const number7Collected = ref(false)

// 成就数据
const achievements = [
  { id: 'first_snack', title: '初次品尝', description: '收集了第一个零食！', trigger: 1 },
  { id: 'snack_lover', title: '零食爱好者', description: '收集了5个零食！', trigger: 5 },
  { id: 'rare_collector', title: '稀有收藏家', description: '收集了第一个稀有零食！', trigger: 'rare' },
  { id: 'epic_hunter', title: '史诗猎人', description: '收集了第一个史诗零食！', trigger: 'epic' },
  { id: 'completionist', title: '完美主义者', description: '收集了所有零食！', trigger: 'all' }
]

// 计算属性
const collectedCount = computed(() => {
  return snackClouds.filter(snack => snack.collected).length
})

const collectionProgress = computed(() => {
  return (collectedCount.value / snackClouds.length) * 100
})

const hasRareSnack = computed(() => {
  return snackClouds.some(snack => snack.collected && snack.rarity === 'rare')
})

const hasEpicSnack = computed(() => {
  return snackClouds.some(snack => snack.collected && snack.rarity === 'epic')
})

const allSnacksCollected = computed(() => {
  return collectedCount.value === snackClouds.length
})

// 背景星星样式生成
const getBackgroundStarStyle = (index) => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 6 + 's',
    fontSize: (8 + Math.random() * 6) + 'px',
    opacity: 0.3 + Math.random() * 0.4
  }
}

// 臭臭悬停处理
const onChouChouHover = () => {
  console.log('🐱 鼠标悬停在臭臭身上')
  chouChouState.isHovered = true
  showProtectionAura.value = true
  
  // 如果信任度足够，显示开心表情
  if (chouChouState.trust > 50) {
    chouChouState.mood = 'happy'
  }
}

// 臭臭离开悬停
const onChouChouLeave = () => {
  console.log('🐱 鼠标离开臭臭')
  chouChouState.isHovered = false
  showProtectionAura.value = false
  
  // 恢复默认心情
  if (chouChouState.mood === 'happy') {
    chouChouState.mood = 'neutral'
  }
}

// 臭臭点击处理
const onChouChouClick = () => {
  console.log('🐱 点击了臭臭')
  
  // 增加信任度
  if (chouChouState.trust < 100) {
    chouChouState.trust = Math.min(100, chouChouState.trust + 10)
    console.log('信任度增加到:', chouChouState.trust)
  }
  
  // 播放温柔音效
  playGentleSound()
}

// 零食云朵点击处理
const onSnackCloudClick = (index) => {
  const snack = snackClouds[index]
  console.log('🍭 点击了零食云朵:', snack.name)

  if (snack.collected) {
    console.log('这个零食已经收集过了')
    return
  }

  // 收集零食
  snack.collected = true
  collectedSnacks.value.push(snack.name)
  console.log('收集了:', snack.name, '稀有度:', snack.rarity)

  // 增加臭臭的舒适度和减少饥饿度
  chouChouState.comfort = Math.min(100, chouChouState.comfort + 5)
  chouChouState.hunger = Math.max(0, chouChouState.hunger - 10)

  // 根据稀有度增加不同的信任度
  const trustBonus = snack.rarity === 'epic' ? 15 : snack.rarity === 'rare' ? 10 : 5
  chouChouState.trust = Math.min(100, chouChouState.trust + trustBonus)

  // 播放收集音效
  playCollectionSound(snack.rarity)

  // 显示收集反馈
  const rarityText = snack.rarity === 'epic' ? '史诗' : snack.rarity === 'rare' ? '稀有' : '普通'
  showActionFeedbackMessage(snack.emoji, `收集了${rarityText}零食：${snack.name}！臭臭很喜欢！`)

  // 检查成就
  checkAchievements()

  // 如果臭臭很开心，显示开心表情
  if (chouChouState.comfort > 80) {
    chouChouState.mood = 'happy'
    setTimeout(() => {
      if (chouChouState.mood === 'happy') {
        chouChouState.mood = 'neutral'
      }
    }, 3000)
  }
}

// 播放温柔音效
const playGentleSound = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()
    
    // 创建温柔的音效
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 0.3)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (error) {
    console.log('音效播放失败:', error)
  }
}

// 播放收集音效
const playCollectionSound = (rarity) => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    // 根据稀有度播放不同音效
    const frequencies = {
      common: [523, 659], // C-E
      rare: [523, 659, 784], // C-E-G
      epic: [523, 659, 784, 1047] // C-E-G-C
    }

    const freqs = frequencies[rarity] || frequencies.common

    freqs.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.3)
      }, i * 100)
    })
  } catch (error) {
    console.log('收集音效播放失败:', error)
  }
}

// 检查成就
const checkAchievements = () => {
  achievements.forEach(achievement => {
    if (achievement.triggered) return

    let shouldTrigger = false

    switch (achievement.trigger) {
      case 1:
      case 5:
        shouldTrigger = collectedCount.value === achievement.trigger
        break
      case 'rare':
        shouldTrigger = hasRareSnack.value
        break
      case 'epic':
        shouldTrigger = hasEpicSnack.value
        break
      case 'all':
        shouldTrigger = allSnacksCollected.value
        break
    }

    if (shouldTrigger) {
      achievement.triggered = true
      showAchievementNotification(achievement)

      // 如果收集完所有零食，显示导航按钮
      if (achievement.id === 'completionist') {
        setTimeout(() => {
          showNavigationButton.value = true
        }, 3000)
      }
    }
  })

  // 检查数字7解锁条件：所有属性达到100%
  if (!number7Collected.value &&
      chouChouState.comfort === 100 &&
      chouChouState.hunger === 0 &&
      chouChouState.trust === 100) {
    showNumber7.value = true
    console.log('✨ 臭臭所有属性满值！数字7解锁！')
    console.log('当前属性值:', {
      comfort: chouChouState.comfort,
      hunger: chouChouState.hunger,
      trust: chouChouState.trust
    })
  }
}

// 显示成就通知
const showAchievementNotification = (achievement) => {
  currentAchievement.value = achievement
  showAchievement.value = true

  console.log('🏆 解锁成就:', achievement.title)

  // 3秒后隐藏
  setTimeout(() => {
    showAchievement.value = false
  }, 3000)
}

// 显示操作反馈
const showActionFeedbackMessage = (icon, message) => {
  actionFeedback.value = { icon, message }
  showActionFeedback.value = true

  // 2秒后隐藏
  setTimeout(() => {
    showActionFeedback.value = false
  }, 2000)
}

// 数字7点击处理
const handleNumber7Click = () => {
  if (!showNumber7.value || number7Collected.value) return

  const success = numberCollector.collectNumber(3, 7, 'chouchou_full_stats')
  if (success) {
    number7Collected.value = true
    showNumber7.value = false
    console.log('🎉 成功收集数字7!')

    // 显示收集成功反馈
    showActionFeedbackMessage('7️⃣', '一个神秘的数字，似乎代表了什么意义。')
  }
}

// 关闭温柔提示
const closeGentleHint = (event) => {
  console.log('👆 用户手动关闭温柔提示', event)
  console.log('🎯 点击事件详情:', {
    target: event?.target,
    currentTarget: event?.currentTarget,
    type: event?.type
  })
  showGentleHint.value = false
}

// 轻抚臭臭
const petChouChou = () => {
  console.log('🤲 轻抚臭臭')

  // 增加舒适度和信任度
  chouChouState.comfort = Math.min(100, chouChouState.comfort + 8)
  chouChouState.trust = Math.min(100, chouChouState.trust + 5)

  // 设置心情为开心
  chouChouState.mood = 'happy'
  setTimeout(() => {
    if (chouChouState.mood === 'happy') {
      chouChouState.mood = 'neutral'
    }
  }, 4000)

  // 播放温柔音效
  playGentleSound()

  // 显示反馈消息
  showActionFeedbackMessage('🤲', '臭臭感受到了你的温柔抚摸，很开心！')

  // 设置冷却时间
  startCooldown('pet', 8)
}

// 陪它玩耍
const playwithChouChou = () => {
  console.log('🎾 陪臭臭玩耍')

  // 增加舒适度，减少饥饿度
  chouChouState.comfort = Math.min(100, chouChouState.comfort + 12)
  chouChouState.hunger = Math.max(0, chouChouState.hunger - 5)
  chouChouState.trust = Math.min(100, chouChouState.trust + 8)

  // 设置心情为开心
  chouChouState.mood = 'happy'
  setTimeout(() => {
    if (chouChouState.mood === 'happy') {
      chouChouState.mood = 'neutral'
    }
  }, 5000)

  // 播放玩耍音效
  playPlaySound()

  // 显示反馈消息
  showActionFeedbackMessage('🎾', '臭臭和你玩得很开心，活力满满！')

  // 设置冷却时间
  startCooldown('play', 12)
}

// 唱摇篮曲
const singToChouChou = () => {
  console.log('🎵 给臭臭唱摇篮曲')

  // 大幅增加舒适度
  chouChouState.comfort = Math.min(100, chouChouState.comfort + 15)
  chouChouState.trust = Math.min(100, chouChouState.trust + 10)

  // 设置心情为困倦
  chouChouState.mood = 'sleepy'
  setTimeout(() => {
    if (chouChouState.mood === 'sleepy') {
      chouChouState.mood = 'neutral'
    }
  }, 8000)

  // 播放摇篮曲音效
  playLullabySound()

  // 显示反馈消息
  showActionFeedbackMessage('🎵', '你的摇篮曲让臭臭感到安心，准备睡觉了...')

  // 设置冷却时间
  startCooldown('sing', 15)
}

// 整理环境
const cleanEnvironment = () => {
  console.log('✨ 整理环境')

  // 增加舒适度
  chouChouState.comfort = Math.min(100, chouChouState.comfort + 10)
  chouChouState.trust = Math.min(100, chouChouState.trust + 3)

  // 播放清理音效
  playCleanSound()

  // 显示反馈消息
  showActionFeedbackMessage('✨', '环境变得整洁了，臭臭很满意这个舒适的空间！')

  // 设置冷却时间
  startCooldown('clean', 10)
}

// 开始冷却计时
const startCooldown = (type, seconds) => {
  const cooldownRef = {
    pet: petCooldown,
    play: playCooldown,
    sing: singCooldown,
    clean: cleanCooldown
  }[type]

  cooldownRef.value = seconds

  const timer = setInterval(() => {
    cooldownRef.value--
    if (cooldownRef.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 播放玩耍音效
const playPlaySound = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    // 播放快乐的音效序列
    const frequencies = [523, 659, 784, 1047, 784, 659] // C-E-G-C-G-E

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
      }, i * 150)
    })
  } catch (error) {
    console.log('玩耍音效播放失败:', error)
  }
}

// 播放摇篮曲音效
const playLullabySound = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    // 播放温柔的摇篮曲
    const frequencies = [392, 440, 392, 349, 392, 440, 392] // G-A-G-F-G-A-G

    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.8)
      }, i * 600)
    })
  } catch (error) {
    console.log('摇篮曲音效播放失败:', error)
  }
}

// 播放清理音效
const playCleanSound = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    // 播放清脆的清理音效
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.1)
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3)
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start()
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log('清理音效播放失败:', error)
  }
}

// 导航到下一章
const goToNextChapter = () => {
  console.log('🚀 前往第四章')
  if (isNavigating.value) return
  
  isNavigating.value = true
  
  try {
    const container = document.querySelector('.chapters-container')
    if (container) {
      container.scrollTo({
        top: window.innerHeight * 3, // 第四章
        behavior: 'smooth'
      })
    }
  } catch (error) {
    console.log('导航错误:', error)
  }
  
  setTimeout(() => {
    isNavigating.value = false
  }, 2000)
}

// 监听章节激活状态
watch(() => props.isActive, (newVal) => {
  console.log('📱 第三章激活状态变化:', newVal)
  if (newVal) {
    console.log('🐱 第三章被激活：臭臭的零食银河')
    
    // 3秒后隐藏温柔提示
    setTimeout(() => {
      showGentleHint.value = false
    }, 3000)
  }
})

// 组件挂载
onMounted(() => {
  console.log('🎬 第三章：臭臭的零食银河 组件已挂载')
})
</script>

<style scoped>
/* 基础章节样式 */
.chapter-3 {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* 章节标题 */
.chapter-title {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.chapter-title h2 {
  font-size: 28px;
  color: #FFB6C1;
  text-shadow: 0 0 20px rgba(255, 182, 193, 0.8);
  margin: 0 0 10px 0;
  animation: titleGlow 3s ease-in-out infinite;
}

.chapter-subtitle {
  font-size: 14px;
  color: #DDA0DD;
  opacity: 0.9;
  margin: 0;
  animation: subtitleFloat 4s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 182, 193, 0.8); }
  50% { text-shadow: 0 0 30px rgba(255, 182, 193, 1); }
}

@keyframes subtitleFloat {
  0%, 100% { opacity: 0.9; transform: translateY(0); }
  50% { opacity: 0.7; transform: translateY(-3px); }
}

/* 银河背景系统 */
.galaxy-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(25, 25, 112, 0.3) 0%,
    rgba(72, 61, 139, 0.4) 30%,
    rgba(147, 112, 219, 0.3) 60%,
    rgba(255, 182, 193, 0.2) 100%
  );
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.6; }
}

/* 背景星星 */
.background-stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bg-star {
  position: absolute;
  color: #FFB6C1;
  animation: starTwinkle 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.2); }
}

/* 零食云朵 */
.snack-clouds {
  position: absolute;
  width: 100%;
  height: 100%;
}

.snack-cloud {
  position: absolute;
  cursor: pointer;
  transition: all 0.3s ease;
}

.snack-cloud:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 15px rgba(255, 182, 193, 0.6));
}

.cloud-base {
  font-size: 24px;
  opacity: 0.7;
  margin-bottom: -10px;
}

.snack-item {
  font-size: 20px;
  position: relative;
  z-index: 2;
  animation: snackBounce 3s ease-in-out infinite;
}

@keyframes cloudFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

@keyframes snackBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* 围绕臭臭的轨道动画 */
@keyframes orbitFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translateY(-8px) scale(1.05);
    opacity: 1;
  }
}

.snack-cloud {
  animation: orbitFloat 6s ease-in-out infinite;
}

/* 稀有度光效 */
.rarity-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.6;
}

.rarity-glow.common {
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
}

.rarity-glow.rare {
  background: radial-gradient(circle, rgba(0, 123, 255, 0.4) 0%, transparent 70%);
  animation: rareGlow 2s ease-in-out infinite;
}

.rarity-glow.epic {
  background: radial-gradient(circle, rgba(138, 43, 226, 0.5) 0%, transparent 70%);
  animation: epicGlow 1.5s ease-in-out infinite;
}

@keyframes rareGlow {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes epicGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}

/* 收集标记 */
.collected-mark {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #32CD32;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  animation: collectMark 0.5s ease-out;
}

@keyframes collectMark {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.snack-cloud.collected {
  opacity: 0.6;
  transform: scale(0.9);
  filter: grayscale(0.3);
}

.snack-cloud.collected:hover {
  transform: scale(0.95);
}

/* 臭臭猫咪容器 */
.chouchou-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}

/* 保护光环 */
.protection-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.protection-aura.active {
  opacity: 1;
}

.aura-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid;
  animation: auraRotate 4s linear infinite;
}

.ring-1 {
  width: 120px;
  height: 120px;
  margin: -60px 0 0 -60px;
  border-color: rgba(255, 182, 193, 0.6);
  animation-duration: 4s;
}

.ring-2 {
  width: 140px;
  height: 140px;
  margin: -70px 0 0 -70px;
  border-color: rgba(221, 160, 221, 0.4);
  animation-duration: 6s;
  animation-direction: reverse;
}

.ring-3 {
  width: 160px;
  height: 160px;
  margin: -80px 0 0 -80px;
  border-color: rgba(255, 192, 203, 0.3);
  animation-duration: 8s;
}

@keyframes auraRotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 臭臭精灵 */
.chouchou-sprite {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: chouChouBreathe 4s ease-in-out infinite;
}

.chouchou-sprite:hover {
  transform: scale(1.05);
}

.chouchou-sprite img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 182, 193, 0.8);
  box-shadow: 0 0 20px rgba(255, 182, 193, 0.6);
  filter: brightness(1.1) saturate(1.2);
}

.chouchou-sprite.happy img {
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
  animation: happyGlow 2s ease-in-out infinite;
}

.chouchou-sprite.scared img {
  border-color: rgba(128, 128, 128, 0.6);
  box-shadow: 0 0 15px rgba(128, 128, 128, 0.4);
  filter: brightness(0.9) saturate(0.8);
}

.chouchou-sprite.sleepy img {
  border-color: rgba(147, 112, 219, 0.6);
  box-shadow: 0 0 20px rgba(147, 112, 219, 0.5);
  filter: brightness(0.95) saturate(1.1);
}

@keyframes chouChouBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes happyGlow {
  0%, 100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.8); }
  50% { box-shadow: 0 0 35px rgba(255, 215, 0, 1); }
}

/* 心情指示器 */
.mood-indicator {
  position: absolute;
  top: -15px;
  right: -15px;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: moodFloat 3s ease-in-out infinite;
}

@keyframes moodFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 舒适度指标 */
.comfort-indicators {
  position: absolute;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
}

.indicator .icon {
  font-size: 14px;
  flex-shrink: 0;
}

.indicator .bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.indicator .fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.comfort .fill {
  background: linear-gradient(90deg, #FFB6C1 0%, #FF69B4 100%);
}

.trust .fill {
  background: linear-gradient(90deg, #DDA0DD 0%, #9370DB 100%);
}

.hunger .fill {
  background: linear-gradient(90deg, #98FB98 0%, #32CD32 100%);
}

.indicator .value {
  color: #FFB6C1;
  font-weight: bold;
  flex-shrink: 0;
  min-width: 30px;
  text-align: right;
}

/* 温柔提示 */
.gentle-hint {
  position: absolute;
  bottom: 500px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: hintAppear 0.5s ease-out;
}

@keyframes hintAppear {
  0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.hint-content {
  background: linear-gradient(135deg, rgba(255, 182, 193, 0.9) 0%, rgba(221, 160, 221, 0.8) 100%);
  border: 2px solid rgba(255, 182, 193, 0.6);
  border-radius: 20px;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 300px;
  position: relative;
  /* 确保子元素可以正常接收点击事件 */
  pointer-events: auto;
}

.hint-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
  animation: hintIconFloat 3s ease-in-out infinite;
}

@keyframes hintIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.hint-content p {
  margin: 0;
  color: #4B0082;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
}

.hint-close-btn {
  position: absolute;
  top: 5px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  font-size: 8px;
  font-weight: bold;
  color: #4B0082;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  /* 增加触摸区域 */
  padding: 4px;
  min-width: 40px;
  min-height: 40px;
  /* 确保在最顶层 */
  z-index: 1000;
  /* 确保可点击 */
  pointer-events: auto;
}

.hint-close-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.hint-close-btn:active {
  transform: scale(1.05);
}

.hint-tips {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.tip {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
}

/* 收集进度显示 */
.collection-progress {
  position: absolute;
  top: 120px;
  left: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 15px;
  padding: 12px 16px;
  min-width: 200px;
  z-index: 10;
}

.progress-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.collection-icon {
  font-size: 16px;
}

.progress-text {
  color: #FFB6C1;
  font-size: 14px;
  font-weight: bold;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FFB6C1 0%, #FF69B4 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
  animation: progressGlow 2s ease-in-out infinite;
}

@keyframes progressGlow {
  0%, 100% { box-shadow: 0 0 5px rgba(255, 105, 180, 0.5); }
  50% { box-shadow: 0 0 15px rgba(255, 105, 180, 0.8); }
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collected-count {
  color: #DDA0DD;
  font-size: 12px;
  font-weight: bold;
}

.progress-percentage {
  color: #FFB6C1;
  font-size: 14px;
  font-weight: bold;
}

/* 数字显示样式 */
.number-display {
  position: absolute;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  animation: numberGlow 2s ease-in-out infinite;
}

.number-display .number-reflection {
  font-size: 25px;
  font-weight: 900;
  color: #FFD700;
  transition: all 0.5s ease;
}

.number-display:hover {
  transform: scale(1.2);
}

/* 数字7的位置 */
.number-7 {
  top: 15%;
  right: 15%;
}

@keyframes numberGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 成就通知 */
.achievement-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  animation: achievementAppear 0.5s ease-out;
}

@keyframes achievementAppear {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.achievement-content {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 3px solid #FF8C00;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  max-width: 300px;
  animation: achievementPulse 2s ease-in-out infinite;
}

@keyframes achievementPulse {
  0%, 100% { box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3); }
  50% { box-shadow: 0 20px 50px rgba(255, 140, 0, 0.4); }
}

.achievement-icon {
  font-size: 40px;
  margin-bottom: 10px;
  animation: achievementSpin 3s ease-in-out infinite;
}

@keyframes achievementSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-5deg) scale(1.05); }
  75% { transform: rotate(5deg) scale(1.1); }
}

.achievement-content h4 {
  margin: 0 0 8px 0;
  color: #8B4513;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
}

.achievement-content p {
  margin: 0;
  color: #2E0854;
  font-size: 14px;
  line-height: 1.4;
}

/* 操作反馈提示 */
.action-feedback {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  animation: feedbackSlideDown 0.5s ease-out;
}

@keyframes feedbackSlideDown {
  0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  100% { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.feedback-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 182, 193, 0.9) 100%);
  border: 2px solid #FFB6C1;
  border-radius: 15px;
  padding: 12px 20px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  max-width: 300px;
  animation: feedbackPulse 2s ease-in-out infinite;
}

@keyframes feedbackPulse {
  0%, 100% { box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2); }
  50% { box-shadow: 0 12px 35px rgba(255, 182, 193, 0.4); }
}

.feedback-icon {
  font-size: 24px;
  margin-bottom: 8px;
  animation: feedbackIconBounce 1s ease-in-out infinite;
}

@keyframes feedbackIconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.feedback-content p {
  margin: 0;
  color: #4B0082;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
}

/* 互动操作面板 */
.interaction-panel {
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 20px;
  padding: 15px;
  z-index: 10;
  min-width: 280px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 182, 193, 0.2);
}

.panel-icon {
  font-size: 16px;
}

.panel-title {
  color: #FFB6C1;
  font-size: 14px;
  font-weight: bold;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 8px;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 60px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.pet-btn {
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  color: #4B0082;
}

.pet-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  transform: scale(1.05);
}

.play-btn {
  background: linear-gradient(135deg, #98FB98 0%, #32CD32 100%);
  color: #2E8B57;
}

.play-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #32CD32 0%, #228B22 100%);
  transform: scale(1.05);
}

.sing-btn {
  background: linear-gradient(135deg, #DDA0DD 0%, #9370DB 100%);
  color: #4B0082;
}

.sing-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #9370DB 0%, #8A2BE2 100%);
  transform: scale(1.05);
}

.clean-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #8B4513;
}

.clean-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  transform: scale(1.05);
}

.btn-icon {
  font-size: 18px;
  animation: btnIconFloat 3s ease-in-out infinite;
}

@keyframes btnIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.btn-text {
  font-size: 11px;
  text-align: center;
  line-height: 1.2;
}

.cooldown {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  animation: cooldownPulse 1s ease-in-out infinite;
}

@keyframes cooldownPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 导航按钮 */
.navigation-button {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
}

.next-chapter-btn {
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: #4B0082;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
  transition: all 0.3s ease;
  animation: btnFloat 3s ease-in-out infinite;
}

@keyframes btnFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.next-chapter-btn:hover {
  background: linear-gradient(135deg, #FF69B4 0%, #FF1493 100%);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 105, 180, 0.6);
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
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%);
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {

  /* 移动端零食位置微调 */
  .snack-cloud {
    transform: scale(0.9); /* 已存在 */
  }
  
  /* 如果需要，可以添加特定零食的位置调整 */
  .snack-cloud:nth-child(7) { /* 甜甜圈 */
    left: 28% !important; /* 移动端稍微右移 */
  }

  .chapter-subtitle {
    font-size: 12px;
  }

  .chouchou-sprite {
    width: 80px;
    height: 80px;
  }

  .aura-ring {
    border-width: 1px;
  }

  .ring-1 {
    width: 100px;
    height: 100px;
    margin: -50px 0 0 -50px;
  }

  .ring-2 {
    width: 120px;
    height: 120px;
    margin: -60px 0 0 -60px;
  }

  .ring-3 {
    width: 140px;
    height: 140px;
    margin: -70px 0 0 -70px;
  }

  .comfort-indicators {
    min-width: 180px;
    top: 110px;
  }

  .indicator {
    padding: 5px 10px;
    font-size: 11px;
  }

  .snack-cloud {
    transform: scale(0.9);
  }

  .cloud-base {
    font-size: 20px;
  }

  .snack-item {
    font-size: 16px;
  }

  .gentle-hint {
    bottom: 80px;
  }

  .hint-content {
    margin: 0 20px;
    padding: 12px 16px;
  }

  .hint-content p {
    font-size: 13px;
  }

  .navigation-button {
    bottom: 20px;
    right: 20px;
  }

  .next-chapter-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .interaction-panel {
    bottom: 20px;
    left: 20px;
    min-width: 240px;
    padding: 12px;
  }

  .action-buttons {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .action-btn {
    padding: 8px 6px;
    min-height: 50px;
  }

  .btn-icon {
    font-size: 16px;
  }

  .btn-text {
    font-size: 10px;
  }

  .collection-progress {
    top: 100px;
    left: 20px;
    min-width: 180px;
    padding: 10px 12px;
  }

  .navigation-button {
    bottom: 20px;
    right: 20px;
  }

  .hint-close-btn {
    width: 25px;
    height: 27px;
    min-width: 20px;
    min-height: 20px;
    font-size: 10px;
    top: 3px;
    right: 5px;
  }
}
</style>

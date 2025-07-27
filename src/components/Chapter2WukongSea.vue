<template>
  <div class="chapter2" :class="{ active: isActive }">
    <!-- 章节标题 -->
    <div class="chapter-title">
      <h2>第二章：悟空的星光海</h2>
      <p class="chapter-subtitle">永恒的守护，闪烁的回忆</p>
    </div>

    <!-- 星海背景 -->
    <div class="starry-sea-background">
      <div class="floating-stars">
        <div v-for="i in 20" :key="i" class="bg-star" :style="getBackgroundStarStyle(i)">⭐</div>
      </div>
      <div class="sea-waves">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
      </div>
    </div>

    <!-- 悟空精灵 -->
    <div
      class="wukong-sprite"
      @mouseenter="onSpriteHover"
      @mouseleave="onSpriteLeave"
      @click="onSpriteClick"
      role="button"
      aria-label="点击悟空精灵查看回忆"
      tabindex="0"
      @keydown.enter="onSpriteClick"
      @keydown.space="onSpriteClick"
    >
      <img src="/images/dog.jpg" alt="悟空" />
      <div v-if="showParticles" class="golden-particles"></div>
      <div class="sprite-halo"></div>
    </div>

    <!-- 数字1,1显示区域 -->
    <div v-if="showNumber1_1 && !number1_1_collected && shouldShowNumbers"
         class="number-display number-1-1"
         :class="{ 'flashing': flashingNumbers }"
         @click="handleNumber1Click(1)">
      <span class="number-reflection">1</span>
    </div>

    <div v-if="showNumber1_2 && !number1_2_collected && shouldShowNumbers"
         class="number-display number-1-2"
         :class="{ 'flashing': flashingNumbers }"
         @click="handleNumber1Click(2)">
      <span class="number-reflection">1</span>
    </div>

    <!-- 隐藏的数字序列 (只有在需要时才显示) -->
    <div v-if="showHiddenNumbers" class="hidden-numbers">
      <!-- 数字8 - 隐藏在左上角星星中 -->
      <div class="hidden-number"
           style="top: 15%; left: 12%;"
           @click="handleNumberClick(8)">
        <span class="number-glow">8</span>
      </div>

      <!-- 数字1 - 隐藏在右上角 -->
      <div class="hidden-number"
           style="top: 20%; right: 18%;"
           @click="handleNumberClick(1)">
        <span class="number-glow">1</span>
      </div>

      <!-- 数字1 - 隐藏在中央偏左 -->
      <div class="hidden-number"
           style="top: 45%; left: 25%;"
           @click="handleNumberClick(1)">
        <span class="number-glow">1</span>
      </div>

      <!-- 数字7 - 隐藏在右侧中央 -->
      <div class="hidden-number"
           style="top: 55%; right: 22%;"
           @click="handleNumberClick(7)">
        <span class="number-glow">7</span>
      </div>

      <!-- 数字3 - 隐藏在左下角 -->
      <div class="hidden-number"
           style="bottom: 25%; left: 15%;"
           @click="handleNumberClick(3)">
        <span class="number-glow">3</span>
      </div>

      <!-- 数字0 - 隐藏在右下角 -->
      <div class="hidden-number"
           style="bottom: 20%; right: 20%;"
           @click="handleNumberClick(0)">
        <span class="number-glow">0</span>
      </div>
    </div>

    <!-- 隐藏的彩蛋星星 -->
    <div class="easter-egg-star"
         @click="onEasterEggStarClick"
         :class="{ glowing: easterEggClicks > 0 }"
         role="button"
         aria-label="神秘星星"
         tabindex="0"
         @keydown.enter="onEasterEggStarClick"
         @keydown.space="onEasterEggStarClick">
      ⭐
      <!-- 点击进度提示 -->
      <div v-if="easterEggClicks > 0 && easterEggClicks < 5" class="click-progress">
        {{ easterEggClicks }}/5
      </div>
    </div>
    
    <!-- 悟空的温馨弹窗 - 使用Teleport传送到body -->
    <Teleport to="body">
      <div v-if="showMemoryDrawer" class="wukong-memory-modal" @click="closeMemoryDrawer">
      <div class="wukong-memory-card" @click.stop>
        <button class="close-btn" @click="closeMemoryDrawer">×</button>

        <!-- 悟空头像区域 -->
        <div class="wukong-header">
          <div class="wukong-avatar">
            <img src="/images/dog.jpg" alt="悟空" />
            <div class="avatar-halo-effect"></div>
          </div>
          <div class="wukong-title">
            <h3>🌟 悟空的星光守护</h3>
            <p class="subtitle">永远的朋友，永恒的陪伴</p>
          </div>
        </div>

        <!-- 悟空的故事 -->
        <div class="wukong-story">
          <div class="story-chapter">
            <div class="chapter-icon">🏠</div>
            <div class="chapter-content">
              <h4>温暖的家</h4>
              <p>悟空总是静静地守在你身边，用它温暖的体温为你驱散寒冷...</p>
            </div>
          </div>

          <div class="story-chapter">
            <div class="chapter-icon">🌙</div>
            <div class="chapter-content">
              <h4>夜晚的守护</h4>
              <p>每个夜晚，它都会悄悄为你盖上毯子，就像天空中最亮的星星...</p>
            </div>
          </div>

          <div class="story-chapter">
            <div class="chapter-icon">💫</div>
            <div class="chapter-content">
              <h4>星光的约定</h4>
              <p>虽然它已经化作星光，但那份爱与守护永远闪烁在我们心中...</p>
            </div>
          </div>
        </div>

        <!-- 互动按钮 -->
        <div class="wukong-actions">
          <button @click="sendWishToWukong" class="wish-btn">
            <span class="btn-icon">🌟</span>
            <span class="btn-text">向悟空许愿</span>
          </button>
          <button @click="collectMemory" class="collect-btn">
            <span class="btn-icon">💝</span>
            <span class="btn-text">收藏回忆</span>
          </button>
        </div>

        <!-- 许愿成功提示已移到独立Teleport -->
      </div>
      </div>
    </Teleport>
    
    <!-- 第一层彩蛋庆祝动画 - 使用Teleport传送到body -->
    <Teleport to="body">
      <div v-if="showFirstEasterEgg" class="easter-egg-celebration">
      <div class="celebration-content">
        <div class="celebration-icon">🎉</div>
        <h3>彩蛋解锁成功！</h3>
        <p>悟空的秘密信件已解锁</p>
        <div class="celebration-stars">
          <div v-for="i in 12" :key="i" class="celebration-star" :style="getCelebrationStarStyle(i)">⭐</div>
        </div>
      </div>
      </div>
    </Teleport>

    <!-- 悟空的秘密信件 - 使用Teleport传送到body -->
    <Teleport to="body">
      <div v-if="showWukongLetter" class="wukong-letter-modal" @click="closeWukongLetter">
      <div class="letter-content" @click.stop>
        <button class="close-btn" @click="closeWukongLetter">×</button>
        <div class="letter-header">
          <div class="letter-icon">💌</div>
          <h3>悟空的秘密信件</h3>
        </div>
        <div class="letter-body">
          <div class="scroll-hint">↓ 向下滑动查看完整信件 ↓</div>
          <div class="letter-text">
            <p class="greeting">亲爱的小主人：</p>
            <p>虽然我已经不能再陪在你身边，但我想告诉你一些秘密...</p>
            <p>每当你难过的时候，我都会化作星光来到你的梦里，轻轻舔舔你的脸颊，告诉你一切都会好起来的。</p>
            <p>记得那些我们一起度过的哪些时光吗？你总是喜欢抱着我晒太阳，我装作不情愿，其实心里比蜜还甜。</p>
            <p>还有那些深夜，当你玩游戏玩到很晚时，我会悄悄守在你脚边，用我的体温为你驱散寒冷和孤独。</p>
            <p>现在，请不要为我难过。我在星空中很快乐，因为我能看到你每天都在成长，都在变得更加坚强和美好。</p>
            <p>答应我，要好好照顾自己，要开心地生活。当你想我的时候，就抬头看看星空，我会在最亮的那颗星上向你摇尾巴。</p>
            <p>我还想告诉你更多的秘密...</p>
            <p>现在我在星空中，遇到了很多朋友，但我最想念的还是和你在一起的时光。每当夜深人静的时候，我都会透过云层看着你，默默守护着你的梦境。</p>
            <p>请记住，无论何时何地，我都会是你最忠诚的朋友。即使我们暂时分别，但我们的心永远连在一起。</p>
            <p class="signature">永远爱你的，<br>悟空 🐕✨</p>
          </div>
        </div>
        <!-- 移除手动解锁开发者信件的按钮 -->
      </div>
      </div>
    </Teleport>

    <!-- 开发者信件已移至全局弹窗，完成所有数字收集后自动显示 -->

    <!-- 许愿成功提示 - 独立全屏显示 -->
    <Teleport to="body">
      <div v-if="showWishSuccess" class="wish-success-overlay" @click="closeWishSuccess">
        <div class="wish-success-card" @click.stop>
          <div class="success-icon">✨</div>
          <h3>许愿成功！</h3>
          <p>你的愿望已传达给悟空，它会在星空中守护你的梦想</p>
          <div class="wish-sparkles">
            <div v-for="i in 8" :key="i" class="sparkle" :style="getSparkleStyle(i)">✨</div>
          </div>
          <div class="wish-hint">点击任意处关闭</div>
        </div>
      </div>
    </Teleport>

    <!-- 导航按钮 -->
    <div v-if="showNavigationButton" class="navigation-button">
      <button
        @click="goToNextChapter"
        class="next-chapter-btn"
        aria-label="前往第三章：臭臭的零食银河"
        :disabled="isNavigating"
      >
        <span class="btn-text">下一章</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>

    <!-- 返回按钮 -->
    <div class="prev-navigation-button">
      <button
        @click="goToPrevChapter"
        class="prev-chapter-btn"
        aria-label="返回第一章：龙蛋启航"
      >
        <span class="btn-arrow">←</span>
        <span class="btn-text">上一章</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import numberCollector from '../utils/numberCollector.js'

// Props
const props = defineProps({
  isActive: Boolean
})

// Emits
const emit = defineEmits(['chapter-complete', 'next-chapter', 'prev-chapter'])

// 响应式状态
const showParticles = ref(false)
const showMemoryDrawer = ref(false)
const showWishSuccess = ref(false)
const showNavigationButton = ref(false)
const isNavigating = ref(false)

// 彩蛋系统状态
const easterEggClicks = ref(0)
const showFirstEasterEgg = ref(false)
const showWukongLetter = ref(false)
const firstEasterEggUnlocked = ref(false)

// 数字收集系统 - 第二章数字1,1
const showNumber1_1 = ref(false)
const showNumber1_2 = ref(false)
const number1_1_collected = ref(false)
const number1_2_collected = ref(false)
const flashingNumbers = ref(false)

// 检查是否应该显示数字（基于收集顺序）
const shouldShowNumbers = computed(() => {
  return numberCollector.shouldShowNumber(2, 1)
})

// 删除摩斯密码相关配置

// 音效播放函数（带错误处理）
const playSound = (type) => {
  try {
    // 检查浏览器支持
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.log('浏览器不支持Web Audio API')
      return
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    // 检查音频上下文状态
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (type === 'hover') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.3)
    } else if (type === 'click') {
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  } catch (error) {
    console.log('音效播放失败:', error)
  }
}

// 悟空精灵悬停处理
const onSpriteHover = () => {
  showParticles.value = true
  playSound('hover')
}

const onSpriteLeave = () => {
  showParticles.value = false
}

// 悟空精灵点击处理
const onSpriteClick = () => {
  console.log('🐕 悟空精灵被点击了！')
  console.log('当前 showMemoryDrawer 状态:', showMemoryDrawer.value)

  // 直接显示温馨回忆弹窗
  showMemoryDrawer.value = true
  console.log('设置 showMemoryDrawer 为 true')
  console.log('新的 showMemoryDrawer 状态:', showMemoryDrawer.value)

  playSound('click')
  console.log('播放点击音效')
}

// 彩蛋星星点击处理
const onEasterEggStarClick = () => {
  console.log('⭐ 彩蛋星星被点击了！')
  console.log('当前点击次数:', easterEggClicks.value)

  easterEggClicks.value++
  console.log('点击次数增加到:', easterEggClicks.value)

  // 播放点击音效
  playSound('click')
  console.log('播放彩蛋点击音效')

  // 连续点击5次解锁第一层彩蛋
  if (easterEggClicks.value >= 5 && !firstEasterEggUnlocked.value) {
    console.log('🎉 达到5次点击，解锁第一层彩蛋！')
    firstEasterEggUnlocked.value = true
    triggerFirstEasterEgg()
  } else {
    console.log('还需要点击', 5 - easterEggClicks.value, '次解锁彩蛋')
  }
}

// 触发第一层彩蛋
const triggerFirstEasterEgg = () => {
  console.log('🎉 触发第一层彩蛋庆祝动画')
  console.log('当前 showFirstEasterEgg 状态:', showFirstEasterEgg.value)

  showFirstEasterEgg.value = true
  console.log('显示第一层彩蛋庆祝动画')

  // 3秒后隐藏庆祝动画，显示悟空信件
  setTimeout(() => {
    console.log('3秒后隐藏庆祝动画，显示悟空信件')
    showFirstEasterEgg.value = false
    showWukongLetter.value = true
    console.log('设置 showWukongLetter 为 true:', showWukongLetter.value)

    // 标记悟空信件已解锁，用于第五章查看
    localStorage.setItem('wukongLetterUnlocked', 'true')
    console.log('✅ 悟空信件解锁状态已保存')
  }, 3000)
}

// 关闭悟空信件
const closeWukongLetter = () => {
  console.log('❌ 关闭悟空信件')
  showWukongLetter.value = false

  // 触发第四章悟空信件解锁
  console.log('🔓 触发第四章悟空信件解锁')
  window.dispatchEvent(new CustomEvent('unlockWukongLetter'))

  // 显示数字1,1 (5秒内可点击)
  if (!number1_1_collected.value && !number1_2_collected.value) {
    showNumber1_1.value = true
    showNumber1_2.value = true
    flashingNumbers.value = true

    setTimeout(() => {
      flashingNumbers.value = false
    }, 5000)
  }
}

// 数字点击处理
const handleNumber1Click = (numberIndex) => {
  if (!flashingNumbers.value) return

  if (numberIndex === 1 && !number1_1_collected.value) {
    const success = numberCollector.collectNumber(2, 1, 'starlight_flash_1')
    if (success) {
      number1_1_collected.value = true
      showNumber1_1.value = false
      console.log('🎉 成功收集第一个数字1!')

      // 显示统一提示
      showGlobalHint('一个神秘的数字，似乎代表了什么意义。')
    }
  } else if (numberIndex === 2 && !number1_2_collected.value) {
    const success = numberCollector.collectNumber(2, 1, 'starlight_flash_2')
    if (success) {
      number1_2_collected.value = true
      showNumber1_2.value = false
      console.log('🎉 成功收集第二个数字1!')

      // 显示统一提示
      showGlobalHint('一个神秘的数字，似乎代表了什么意义。')
    }
  }

  // 检查是否都收集完了
  if (number1_1_collected.value && number1_2_collected.value) {
    flashingNumbers.value = false
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

// 数字序列处理函数
const handleNumberClick = (number) => {
  console.log(`🔢 点击数字: ${number}`)

  if (currentSequence.value.length < targetSequence.length) {
    currentSequence.value.push(number)
    sequenceProgress.value = currentSequence.value.length

    // 检查当前输入是否正确
    const isCorrect = currentSequence.value.every((num, index) => num === targetSequence[index])

    if (!isCorrect) {
      console.log('❌ 序列错误，重置')
      currentSequence.value = []
      sequenceProgress.value = 0
      // 显示错误提示
      setTimeout(() => {
        console.log('💭 提示：重要的日期...')
      }, 500)
      return
    }

    if (currentSequence.value.length === targetSequence.length) {
      console.log('✅ 数字序列完成！')
      numberSequenceUnlocked.value = true
      // 第二层彩蛋已移除，改为全局数字收集完成触发
    } else {
      console.log(`🎯 进度: ${currentSequence.value.length}/${targetSequence.length}`)
    }
  }
}

// 第二层彩蛋功能已移除，开发者信件改为全局数字收集完成后触发

// 开发者信件关闭功能已移除，改为全局弹窗

// 背景星星样式
const getBackgroundStarStyle = (index) => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    animationDelay: Math.random() * 3 + 's',
    animationDuration: (2 + Math.random() * 2) + 's'
  }
}

// 许愿闪烁星星样式
const getSparkleStyle = (index) => {
  const angle = (index * 45) // 每45度一个星星
  const radius = 60 + Math.random() * 40 // 随机半径
  return {
    '--angle': angle + 'deg',
    '--radius': radius + 'px',
    animationDelay: (index * 0.2) + 's'
  }
}

// 庆祝星星样式
const getCelebrationStarStyle = (index) => {
  const angle = (index * 30) % 360
  return {
    '--angle': angle + 'deg',
    animationDelay: (index * 0.1) + 's'
  }
}

// 删除摩斯密码点击处理

// 删除不需要的摩斯密码相关方法

// 导航到下一章（发射事件给父组件）
const goToNextChapter = () => {
  console.log('🚀 下一章按钮被点击')

  if (isNavigating.value) {
    console.log('正在导航中，忽略点击')
    return
  }

  isNavigating.value = true
  console.log('发射next-chapter事件')

  try {
    // 发射事件给父组件进行章节切换
    emit('next-chapter')
  } catch (error) {
    console.log('导航错误:', error)
  }

  setTimeout(() => {
    isNavigating.value = false
    console.log('导航状态重置')
  }, 500)
}

// 返回上一章（发射事件给父组件）
const goToPrevChapter = () => {
  console.log('🔙 返回上一章按钮被点击')
  emit('prev-chapter')
  console.log('✅ prev-chapter 事件已发射')
}

// 删除触发隐藏章节方法

// 关闭回忆抽屉
const closeMemoryDrawer = () => {
  console.log('❌ 关闭悟空回忆弹窗')
  console.log('当前 showMemoryDrawer 状态:', showMemoryDrawer.value)
  showMemoryDrawer.value = false
  console.log('设置 showMemoryDrawer 为 false')
}

// 向悟空许愿
const sendWishToWukong = () => {
  console.log('🌟 向悟空许愿按钮被点击')
  console.log('当前 showWishSuccess 状态:', showWishSuccess.value)

  showWishSuccess.value = true
  console.log('显示全屏许愿成功提示')

  // 播放许愿音效
  playWishSound()
  console.log('播放许愿音效')

  // 4秒后自动隐藏成功提示
  setTimeout(() => {
    showWishSuccess.value = false
    console.log('自动隐藏许愿成功提示')
  }, 4000)
}

// 关闭许愿成功提示
const closeWishSuccess = () => {
  console.log('👆 用户点击关闭许愿成功提示')
  showWishSuccess.value = false
}

// 许愿音效
const playWishSound = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) return

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()

    // 创建一个美妙的和弦
    const frequencies = [523.25, 659.25, 783.99] // C-E-G和弦

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

      oscillator.start(audioContext.currentTime + index * 0.2)
      oscillator.stop(audioContext.currentTime + index * 0.2 + 1.5)
    })
  } catch (error) {
    console.log('许愿音效播放失败:', error)
  }
}

// 收藏回忆
const collectMemory = () => {
  console.log('💝 收藏回忆按钮被点击')
  console.log('当前 showNavigationButton 状态:', showNavigationButton.value)

  // 播放收藏音效
  playSound('click')
  console.log('播放收藏音效')

  // 关闭弹窗并显示导航按钮
  setTimeout(() => {
    console.log('0.5秒后关闭弹窗并显示导航按钮')
    closeMemoryDrawer()
    showNavigationButton.value = true
    console.log('设置 showNavigationButton 为 true:', showNavigationButton.value)
  }, 500)
}

// 删除摩斯密码闪烁动画

// 监听章节激活状态
watch(() => props.isActive, (newVal) => {
  console.log('📱 第二章激活状态变化:', newVal)
  if (newVal) {
    console.log('🌟 第二章被激活：悟空的星光海')
    console.log('当前所有状态:')
    console.log('- showMemoryDrawer:', showMemoryDrawer.value)
    console.log('- showWishSuccess:', showWishSuccess.value)
    console.log('- showNavigationButton:', showNavigationButton.value)
    console.log('- easterEggClicks:', easterEggClicks.value)
    console.log('- firstEasterEggUnlocked:', firstEasterEggUnlocked.value)

    // 章节激活时的初始化
    setTimeout(() => {
      console.log('第二章初始化完成，可以开始交互')
    }, 1000)
  }
})

// 组件挂载
onMounted(() => {
  console.log('🎬 第二章：悟空的星光海 组件已挂载')
  console.log('初始状态检查:')
  console.log('- props.isActive:', props.isActive)
  console.log('- showMemoryDrawer:', showMemoryDrawer.value)
  console.log('- showNavigationButton:', showNavigationButton.value)
  console.log('- easterEggClicks:', easterEggClicks.value)

  // 检查DOM元素是否正确渲染
  setTimeout(() => {
    const sprite = document.querySelector('.wukong-sprite')
    const easterEggStar = document.querySelector('.easter-egg-star')
    console.log('DOM元素检查:')
    console.log('- 悟空精灵元素:', sprite ? '✅ 存在' : '❌ 不存在')
    console.log('- 彩蛋星星元素:', easterEggStar ? '✅ 存在' : '❌ 不存在')

    if (sprite) {
      console.log('悟空精灵位置:', sprite.getBoundingClientRect())
    }
    if (easterEggStar) {
      console.log('彩蛋星星位置:', easterEggStar.getBoundingClientRect())
    }
  }, 100)
})
</script>

<style>
/* 全局弹窗样式 - 不受scoped限制 */
.wukong-memory-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.85) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 2000 !important;
  animation: modalFadeIn 0.5s ease-out !important;
}

.easter-egg-celebration {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.85) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3000 !important;
  animation: celebrationAppear 0.5s ease-out !important;
}

.wukong-letter-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.9) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 3500 !important;
  animation: letterModalAppear 0.5s ease-out !important;
}

.developer-letter-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.95) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 4000 !important;
  animation: developerModalAppear 0.5s ease-out !important;
}
</style>

<style scoped>
.chapter2 {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.5s ease;
}

.chapter2.active {
  opacity: 1;
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

/* 星海背景 */
.starry-sea-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.floating-stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bg-star {
  position: absolute;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  animation: bgStarFloat 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes bgStarFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
}

/* 海浪效果 */
.sea-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(255, 194, 239, 0.2) 100%);
  border-radius: 50% 50% 0 0;
  animation: waveMove 8s ease-in-out infinite;
}

.wave1 {
  animation-delay: 0s;
  opacity: 0.7;
}

.wave2 {
  animation-delay: 2s;
  opacity: 0.5;
  height: 80%;
}

.wave3 {
  animation-delay: 4s;
  opacity: 0.3;
  height: 60%;
}

@keyframes waveMove {
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  50% { transform: translateX(-60%) rotate(1deg); }
}

/* 悟空精灵 - S型浮动动画 */
.wukong-sprite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  cursor: pointer;
  animation: floatS 8s ease-in-out infinite;
  z-index: 2;
}

.wukong-sprite img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  transition: all 0.3s ease;
}

.wukong-sprite:hover img {
  transform: scale(1.1);
  filter: brightness(1.3) saturate(1.4) drop-shadow(0 0 25px rgba(255, 215, 0, 0.9));
}

/* 精灵光环 */
.sprite-halo {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px solid rgba(255, 215, 0, 0.6);
  border-radius: 50%;
  animation: haloRotate 4s linear infinite;
  pointer-events: none;
}

@keyframes haloRotate {
  0% { transform: rotate(0deg); border-color: rgba(255, 215, 0, 0.6); }
  25% { border-color: rgba(255, 255, 255, 0.8); }
  50% { transform: rotate(180deg); border-color: rgba(255, 194, 239, 0.6); }
  75% { border-color: rgba(255, 255, 255, 0.8); }
  100% { transform: rotate(360deg); border-color: rgba(255, 215, 0, 0.6); }
}

/* 摩斯密码指导 */
.morse-guide {
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
  animation: guideAppear 0.5s ease-out;
}

@keyframes guideAppear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.guide-content {
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  border: 3px solid #DAA520;
  border-radius: 25px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  animation: contentSlideUp 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes contentSlideUp {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.guide-content h3 {
  color: #8B4513;
  font-size: 22px;
  margin-bottom: 15px;
}

.guide-content p {
  color: #2E0854;
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.5;
}

.morse-hint {
  background: rgba(255, 255, 255, 0.7);
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #8A2BE2;
}

.hint-text {
  color: #8B4513;
  font-size: 14px;
  margin-bottom: 10px;
  font-weight: bold;
}

.morse-pattern {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.pattern-num {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  animation: numPulse 2s ease-in-out infinite;
}

.pattern-num:nth-child(odd) {
  animation-delay: 0.5s;
}

@keyframes numPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.start-challenge-btn {
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

.start-challenge-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

/* S型浮动轨迹动画 - 更流畅的贝塞尔曲线 */
@keyframes floatS {
  0% {
    transform: translate(0, 0) rotate(0deg) scale(1);
    filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  }
  10% {
    transform: translate(20px, -8px) rotate(30deg) scale(1.02);
    filter: brightness(1.12) saturate(1.22) drop-shadow(0 0 16px rgba(255, 215, 0, 0.65));
  }
  20% {
    transform: translate(45px, -20px) rotate(60deg) scale(1.05);
    filter: brightness(1.15) saturate(1.25) drop-shadow(0 0 18px rgba(255, 215, 0, 0.7));
  }
  30% {
    transform: translate(65px, -35px) rotate(90deg) scale(1.08);
    filter: brightness(1.18) saturate(1.28) drop-shadow(0 0 20px rgba(255, 215, 0, 0.75));
  }
  40% {
    transform: translate(70px, -50px) rotate(120deg) scale(1.1);
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 22px rgba(255, 215, 0, 0.8));
  }
  50% {
    transform: translate(60px, -65px) rotate(180deg) scale(1.05);
    filter: brightness(1.15) saturate(1.25) drop-shadow(0 0 20px rgba(255, 215, 0, 0.75));
  }
  60% {
    transform: translate(30px, -70px) rotate(210deg) scale(1.08);
    filter: brightness(1.18) saturate(1.28) drop-shadow(0 0 22px rgba(255, 215, 0, 0.8));
  }
  70% {
    transform: translate(-10px, -60px) rotate(240deg) scale(1.1);
    filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 24px rgba(255, 215, 0, 0.85));
  }
  80% {
    transform: translate(-40px, -35px) rotate(270deg) scale(1.05);
    filter: brightness(1.15) saturate(1.25) drop-shadow(0 0 20px rgba(255, 215, 0, 0.75));
  }
  90% {
    transform: translate(-30px, -15px) rotate(330deg) scale(1.02);
    filter: brightness(1.12) saturate(1.22) drop-shadow(0 0 16px rgba(255, 215, 0, 0.65));
  }
  100% {
    transform: translate(0, 0) rotate(360deg) scale(1);
    filter: brightness(1.1) saturate(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
  }
}

/* 金色光粒效果 */
.golden-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.golden-particles::before,
.golden-particles::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #FFD700 0%, #FFA500 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px #FFD700;
  animation: particleFall 2s ease-out infinite;
}

.golden-particles::before {
  left: 15%;
  animation-delay: 0s;
}

.golden-particles::after {
  right: 15%;
  animation-delay: 0.7s;
}

/* 添加更多粒子 */
.golden-particles {
  background-image:
    radial-gradient(2px 2px at 30px 40px, #FFD700, transparent),
    radial-gradient(2px 2px at 70px 30px, #FFA500, transparent),
    radial-gradient(1px 1px at 50px 60px, #FFD700, transparent),
    radial-gradient(1px 1px at 80px 50px, #FFA500, transparent);
  animation: particleSwirl 3s ease-in-out infinite;
}

@keyframes particleFall {
  0% {
    opacity: 1;
    transform: translateY(-25px) scale(0);
  }
  20% {
    opacity: 1;
    transform: translateY(-15px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(80px) scale(0.5);
  }
}

@keyframes particleSwirl {
  0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
  50% { transform: translate(-50%, -50%) rotate(180deg); }
}

/* 隐藏数字样式 */
.hidden-numbers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
}

.hidden-number {
  position: absolute;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.hidden-number:hover {
  opacity: 1;
  transform: scale(1.2);
}

.number-glow {
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  color: #ffd700;
  text-shadow:
    0 0 5px #ffd700,
    0 0 10px #ffd700,
    0 0 15px #ffd700,
    0 0 20px #ffd700;
  animation: numberPulse 2s ease-in-out infinite;
}

@keyframes numberPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 数字显示样式 */
.number-display {
  position: absolute;
  cursor: pointer;
  z-index: 5;
  transition: all 0.3s ease;
}

.number-display .number-reflection {
  font-size: 25px;
  font-weight: 900;
  color: #FFD700;
  transition: all 0.5s ease;
}

.number-display.flashing {
  animation: numberFlash 1s ease-in-out infinite;
}

.number-display:hover {
  transform: scale(1.2);
}

/* 数字1,1的位置 */
.number-1-1 {
  top: 20%;
  left: 15%;
}

.number-1-2 {
  top: 60%;
  right: 20%;
}

@keyframes numberFlash {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 彩蛋星星 */
.easter-egg-star {
  position: absolute;
  top: 25%;
  right: 20%;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
  animation: easterEggFloat 4s ease-in-out infinite;
  z-index: 5;
}

.easter-egg-star:hover {
  transform: scale(1.3);
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
}

.easter-egg-star.glowing {
  color: #FFD700;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  animation: easterEggGlow 2s ease-in-out infinite;
}

@keyframes easterEggFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-15px) rotate(10deg);
    opacity: 1;
  }
}

@keyframes easterEggGlow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8));
  }
  50% {
    transform: scale(1.2);
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1));
  }
}

/* 点击进度提示 */
.click-progress {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 215, 0, 0.9);
  color: #4B0082;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  animation: progressBounce 0.5s ease-out;
}

@keyframes progressBounce {
  0% { transform: translateX(-50%) scale(0); opacity: 0; }
  50% { transform: translateX(-50%) scale(1.2); opacity: 1; }
  100% { transform: translateX(-50%) scale(1); opacity: 1; }
}

/* 悟空温馨弹窗 */
.wukong-memory-modal {
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

@keyframes modalFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.wukong-memory-card {
  background: linear-gradient(135deg, #FFF8DC 0%, #F0E68C 100%);
  border: 3px solid #DAA520;
  border-radius: 25px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  animation: cardSlideUp 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

@keyframes cardSlideUp {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #8B4513;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  color: #A0522D;
  transform: scale(1.1);
}

/* 悟空头像区域 */
.wukong-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #DAA520;
}

.wukong-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  flex-shrink: 0;
}

.wukong-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.1) saturate(1.2);
}

.avatar-halo-effect {
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
  z-index: -1;
  animation: haloGlow 3s linear infinite;
}

@keyframes haloGlow {
  0% { transform: rotate(0deg); opacity: 0.7; }
  50% { opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.7; }
}

.wukong-title h3 {
  margin: 0 0 5px 0;
  color: #8B4513;
  font-size: 20px;
}

.subtitle {
  margin: 0;
  color: #2E0854;
  font-size: 14px;
  opacity: 0.8;
}

/* 悟空的故事 */
.wukong-story {
  margin-bottom: 25px;
}

.story-chapter {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  border-left: 4px solid #8A2BE2;
  animation: chapterAppear 0.8s ease-out;
}

.story-chapter:nth-child(1) { animation-delay: 0.2s; }
.story-chapter:nth-child(2) { animation-delay: 0.4s; }
.story-chapter:nth-child(3) { animation-delay: 0.6s; }

@keyframes chapterAppear {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.chapter-icon {
  font-size: 24px;
  flex-shrink: 0;
  animation: iconFloat 3s ease-in-out infinite;
}

.chapter-icon:nth-child(1) { animation-delay: 0s; }
.chapter-icon:nth-child(2) { animation-delay: 1s; }
.chapter-icon:nth-child(3) { animation-delay: 2s; }

@keyframes iconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.chapter-content h4 {
  margin: 0 0 8px 0;
  color: #8B4513;
  font-size: 16px;
}

.chapter-content p {
  margin: 0;
  color: #2E0854;
  font-size: 14px;
  line-height: 1.5;
}

/* 互动按钮 */
.wukong-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.wish-btn, .collect-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.wish-btn {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: #8B4513;
}

.wish-btn:hover {
  background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
}

.collect-btn {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  color: white;
}

.collect-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
}

.btn-icon {
  font-size: 16px;
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 许愿成功提示 - 全屏独立显示 */
.wish-success-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.7) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 5000 !important;
  animation: wishOverlayAppear 0.5s ease-out !important;
}

@keyframes wishOverlayAppear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.wish-success-card {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border: 3px solid #FF8C00;
  border-radius: 25px;
  padding: 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  animation: wishCardBounce 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

@keyframes wishCardBounce {
  0% { transform: scale(0.5) translateY(50px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.wish-success-card .success-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: wishIconSpin 3s ease-in-out infinite;
  display: block;
}

@keyframes wishIconSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(10deg) scale(1.1); }
  50% { transform: rotate(-5deg) scale(1.05); }
  75% { transform: rotate(5deg) scale(1.1); }
}

.wish-success-card h3 {
  margin: 0 0 15px 0;
  color: #8B4513;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
}

.wish-success-card p {
  margin: 0 0 20px 0;
  color: #2E0854;
  font-size: 16px;
  line-height: 1.6;
}

.wish-hint {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  color: #8B4513;
  font-size: 12px;
  opacity: 0.8;
  animation: hintBlink 2s ease-in-out infinite;
}

@keyframes hintBlink {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

/* 许愿闪烁星星 */
.wish-sparkles {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20px;
  color: #FFD700;
  animation: sparkleFloat 2s ease-in-out infinite;
  transform-origin: center;
}

@keyframes sparkleFloat {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(0);
    opacity: 0;
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateX(var(--radius, 60px)) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateX(var(--radius, 60px)) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle, 0deg)) translateX(calc(var(--radius, 60px) + 20px)) scale(0);
    opacity: 0;
  }
}

/* 悟空的秘密信件 */
.wukong-letter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3500;
  animation: letterModalAppear 0.5s ease-out;
}

@keyframes letterModalAppear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.letter-content {
  background: linear-gradient(135deg, #FFF8DC 0%, #F5DEB3 100%);
  border: 3px solid #DAA520;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto !important; /* 强制启用滚动，不受全局禁用影响 */
  -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
  overscroll-behavior: contain; /* 防止滚动穿透 */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  animation: letterSlideUp 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

@keyframes letterSlideUp {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.letter-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #DAA520;
}

.letter-icon {
  font-size: 40px;
  margin-bottom: 10px;
  animation: letterIconFloat 3s ease-in-out infinite;
}

@keyframes letterIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.letter-header h3 {
  margin: 0;
  color: #8B4513;
  font-size: 24px;
  text-shadow: 0 2px 4px rgba(139, 69, 19, 0.3);
}

.letter-body {
  margin-bottom: 25px;
  min-height: 400px; /* 确保有足够高度触发滚动 */
}

.scroll-hint {
  text-align: center;
  color: #DAA520;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 8px;
  background: rgba(218, 165, 32, 0.1);
  border-radius: 8px;
  animation: scrollHintPulse 2s ease-in-out infinite;
}

@keyframes scrollHintPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 自定义滚动条样式 */
.letter-content::-webkit-scrollbar {
  width: 8px;
}

.letter-content::-webkit-scrollbar-track {
  background: rgba(218, 165, 32, 0.2);
  border-radius: 4px;
}

.letter-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #DAA520, #B8860B);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.letter-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #B8860B, #DAA520);
}

.letter-text {
  color: #2E0854;
  font-size: 16px;
  line-height: 1.8;
}

.letter-text p {
  margin-bottom: 15px;
  animation: textAppear 0.8s ease-out;
}

.letter-text p:nth-child(1) { animation-delay: 0.1s; }
.letter-text p:nth-child(2) { animation-delay: 0.2s; }
.letter-text p:nth-child(3) { animation-delay: 0.3s; }
.letter-text p:nth-child(4) { animation-delay: 0.4s; }
.letter-text p:nth-child(5) { animation-delay: 0.5s; }
.letter-text p:nth-child(6) { animation-delay: 0.6s; }
.letter-text p:nth-child(7) { animation-delay: 0.7s; }
.letter-text p:nth-child(8) { animation-delay: 0.8s; }

@keyframes textAppear {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.greeting {
  font-weight: bold;
  color: #8B4513 !important;
  font-size: 18px !important;
}

.signature {
  text-align: right;
  font-style: italic;
  color: #8B4513 !important;
  font-weight: bold;
  margin-top: 20px !important;
}

.letter-actions {
  text-align: center;
}

.unlock-btn {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 25px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.4);
  transition: all 0.3s ease;
}

.unlock-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

.unlock-btn .btn-icon {
  font-size: 18px;
  animation: unlockIconPulse 2s ease-in-out infinite;
}

@keyframes unlockIconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 开发者信件 */
.developer-letter-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  animation: developerModalAppear 0.5s ease-out;
}

@keyframes developerModalAppear {
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
  animation: developerSlideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  color: white;
}

@keyframes developerSlideUp {
  0% { transform: translateY(60px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
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
  animation: developerAvatarGlow 3s ease-in-out infinite;
}

@keyframes developerAvatarGlow {
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
  animation: developerTextAppear 1s ease-out;
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

@keyframes developerTextAppear {
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
  padding-top: 15px;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
}

/* 第一层彩蛋庆祝动画 */
.easter-egg-celebration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: celebrationAppear 0.5s ease-out;
}

@keyframes celebrationAppear {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.celebration-content {
  text-align: center;
  color: white;
  animation: celebrationBounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes celebrationBounce {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.celebration-icon {
  font-size: 80px;
  margin-bottom: 20px;
  animation: celebrationSpin 2s ease-in-out infinite;
}

@keyframes celebrationSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

.celebration-content h3 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.celebration-content p {
  font-size: 18px;
  color: #FFC2EF;
  margin-bottom: 30px;
}

.celebration-stars {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.celebration-star {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 20px;
  color: #FFD700;
  animation: celebrationStarFly 2s ease-out infinite;
  transform-origin: center;
}

@keyframes celebrationStarFly {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) rotate(calc(var(--angle, 0deg))) translateX(60px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(calc(var(--angle, 0deg))) translateX(100px) scale(0);
    opacity: 0;
  }
}

/* 导航按钮 */
.navigation-button {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10;
}

/* 返回按钮 */
.prev-navigation-button {
  position: absolute;
  bottom: 30px;
  left: 30px;
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

/* 返回按钮样式 */
.prev-chapter-btn {
  background: linear-gradient(135deg, #8A2BE2 0%, #9932CC 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: btnFloat 3s ease-in-out infinite;
}

.prev-chapter-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

.prev-chapter-btn:hover .btn-arrow {
  transform: translateX(-3px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chapter-title h2 {
    font-size: 20px;
  }

  .chapter-subtitle {
    font-size: 12px;
  }

  .wukong-sprite {
    width: 60px;
    height: 60px;
  }

  .easter-egg-star {
    font-size: 24px;
    top: 20%;
    right: 15%;
  }

  .wukong-memory-card {
    padding: 20px;
    margin: 20px;
  }

  .wukong-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .wukong-avatar {
    width: 70px;
    height: 70px;
  }

  .celebration-content h3 {
    font-size: 24px;
  }

  .celebration-content p {
    font-size: 16px;
  }

  .celebration-icon {
    font-size: 60px;
  }

  .letter-content {
    padding: 25px;
    margin: 15px;
  }

  .letter-text {
    font-size: 15px;
  }

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

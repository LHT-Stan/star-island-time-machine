<template>
  <div class="app">
    <!-- 星空背景 -->
    <div class="star-background">
      <div class="stars"></div>
    </div>
    
    <!-- 章节容器 - 固定视窗，禁用滚动 -->
    <div class="chapters-container" ref="container">
      <!-- 第一章：龙蛋启航 -->
      <Chapter1DragonEgg
        :class="getChapterClass(1)"
        :isActive="currentChapter === 1"
        @chapter-complete="onChapterComplete"
        @next-chapter="goToNextChapter"
      />

      <!-- 第二章：悟空的星光海 -->
      <Chapter2WukongSea
        :class="getChapterClass(2)"
        :isActive="currentChapter === 2"
        @chapter-complete="onChapterComplete"
        @next-chapter="goToNextChapter"
        @prev-chapter="goToPrevChapter"
      />

      <!-- 第三章：臭臭的零食银河 -->
      <Chapter3ChouChouGalaxy
        :class="getChapterClass(3)"
        :isActive="currentChapter === 3"
        @chapter-complete="onChapterComplete"
        @next-chapter="goToNextChapter"
        @prev-chapter="goToPrevChapter"
      />

      <!-- 第四章：白夜的星愿转盘 -->
      <Chapter4StarWishWheel
        :class="getChapterClass(4)"
        :isActive="currentChapter === 4"
        @chapter-complete="onChapterComplete"
        @next-chapter="goToNextChapter"
        @prev-chapter="goToPrevChapter"
      />

      <!-- 第五章：温馨小家贺卡 -->
      <Chapter5WarmHome
        :class="getChapterClass(5)"
        :isActive="currentChapter === 5"
        @chapter-complete="onChapterComplete"
        @prev-chapter="goToPrevChapter"
      />
    </div>



    <!-- 全局开发者信件弹窗 -->
    <GlobalDeveloperLetter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chapter1DragonEgg from './components/Chapter1DragonEgg.vue'
import Chapter2WukongSea from './components/Chapter2WukongSea.vue'
import Chapter3ChouChouGalaxy from './components/Chapter3ChouChouGalaxy.vue'
import Chapter4StarWishWheel from './components/Chapter4StarWishWheel.vue'
import Chapter4TimeCard from './components/Chapter4TimeCard.vue'
import Chapter5WarmHome from './components/Chapter5WarmHome.vue'
import GlobalDeveloperLetter from './components/GlobalDeveloperLetter.vue'

// 响应式状态
const currentChapter = ref(1)
const maxUnlockedChapter = ref(1) // 最大可访问章节
const container = ref(null)

// 章节导航控制
const goToNextChapter = () => {
  if (currentChapter.value < 5) {
    currentChapter.value++
    maxUnlockedChapter.value = Math.max(maxUnlockedChapter.value, currentChapter.value)

    // 标记游戏完成状态
    if (currentChapter.value === 5) {
      localStorage.setItem('gameComplete', 'true')
    }
  }
}

const goToPrevChapter = () => {
  if (currentChapter.value > 1) {
    currentChapter.value--
  }
}



// 获取章节CSS类
const getChapterClass = (chapterNum) => {
  if (chapterNum === currentChapter.value) {
    return 'chapter active'
  } else if (chapterNum < currentChapter.value) {
    return 'chapter prev'
  } else {
    return 'chapter next'
  }
}

// 章节完成处理
const onChapterComplete = (chapterNumber) => {
  console.log(`第${chapterNumber}章完成`)
  // 可以在这里添加全局状态管理
}

// 禁用页面滚动
const disableScroll = () => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('wheel', preventDefault, { passive: false })
  document.addEventListener('touchmove', preventDefault, { passive: false })
  document.addEventListener('keydown', preventScrollKeys, { passive: false })
}

const preventDefault = (e) => {
  // 检查事件是否发生在可滚动的弹窗内
  const scrollableElements = [
    '.letter-content',
    '.wukong-letter-modal',
    '.wukong-letter-content',
    '.developer-letter-modal',
    '.developer-letter-content',
    '.global-developer-modal',
    '.result-modal',
    '.card-modal',
    '.collection-modal',
    '.memory-modal',
    '.card-content',
    '.collection-content',
    '.memory-content',
    '.card-scroll'
  ]

  // 检查事件目标是否在可滚动元素内
  for (const selector of scrollableElements) {
    const element = document.querySelector(selector)
    if (element && element.contains(e.target)) {
      return // 不阻止弹窗内的滚动
    }
  }

  e.preventDefault()
}

const preventScrollKeys = (e) => {
  // 禁用方向键、空格键、Page Up/Down等滚动按键
  const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]
  if (scrollKeys.includes(e.keyCode)) {
    e.preventDefault()
  }
}

// 组件挂载后的初始化
onMounted(() => {
  // 创建星空效果
  createStars()

  // 禁用页面滚动
  disableScroll()

  // 从localStorage恢复进度
  const savedProgress = localStorage.getItem('maxUnlockedChapter')
  if (savedProgress) {
    maxUnlockedChapter.value = parseInt(savedProgress)
  }
})

// 创建星空背景效果（性能优化版）
const createStars = () => {
  const starsContainer = document.querySelector('.stars')
  if (!starsContainer) return

  // 根据设备性能调整星星数量
  const isMobile = window.innerWidth <= 768
  const starCount = isMobile ? 50 : 100

  // 使用DocumentFragment优化DOM操作
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.animationDelay = Math.random() * 3 + 's'
    star.style.animationDuration = (2 + Math.random() * 2) + 's' // 随机动画时长
    fragment.appendChild(star)
  }

  starsContainer.appendChild(fragment)
}
</script>

<style scoped>
.app {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.star-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(135deg, #0c1445 0%, #2a0b5e 50%, #8A2BE2 100%);
}

.stars {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite;
  /* 性能优化 */
  will-change: opacity;
  transform: translateZ(0); /* 启用硬件加速 */
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: translateZ(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateZ(0) scale(1.2);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .star {
    width: 1.5px;
    height: 1.5px;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }
}

.chapters-container {
  position: relative;
  z-index: 1;
  height: 100vh;
  overflow: hidden; /* 禁用滚动 */
  backface-visibility: hidden;
  transform: translateZ(0); /* 启用硬件加速 */
}

/* 章节固定视窗布局 */
.chapter {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(100%); /* 默认隐藏在右侧 */
  z-index: 1;
}

.chapter.active {
  transform: translateX(0); /* 当前章节显示 */
  z-index: 2;
}

.chapter.prev {
  transform: translateX(-100%); /* 前一章节隐藏在左侧 */
  z-index: 1;
}

.chapter.next {
  transform: translateX(100%); /* 后续章节隐藏在右侧 */
  z-index: 1;
}


</style>

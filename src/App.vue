<template>
  <div class="app">
    <!-- 星空背景 -->
    <div class="star-background">
      <div class="stars"></div>
    </div>
    
    <!-- 章节容器 -->
    <div class="chapters-container" @scroll="handleScroll" ref="container">
      <!-- 第一章：龙蛋启航 -->
      <Chapter1DragonEgg 
        :isActive="currentChapter === 1"
        @chapter-complete="onChapterComplete"
      />
      
      <!-- 第二章：悟空的星光海 -->
      <Chapter2WukongSea
        :isActive="currentChapter === 2"
        @chapter-complete="onChapterComplete"
      />

    <!-- 第三章：臭臭的零食银河 -->
    <Chapter3ChouChouGalaxy
      :isActive="currentChapter === 3"
      @chapter-complete="onChapterComplete"
    />
      
      <!-- 第四章：白夜的星愿转盘 -->
      <Chapter4StarWishWheel
        :isActive="currentChapter === 4"
        @chapter-complete="onChapterComplete"
      />

      <!-- 第五章：温馨小家贺卡 -->
      <Chapter5WarmHome
        :isActive="currentChapter === 5"
        @chapter-complete="onChapterComplete"
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
const container = ref(null)

// 滚动处理 - 核心原理：根据滚动位置切换章节（节流优化）
let scrollTimeout = null
const handleScroll = (event) => {
  // 使用节流优化性能
  if (scrollTimeout) return

  scrollTimeout = setTimeout(() => {
    const scrollTop = event.target.scrollTop
    const windowHeight = window.innerHeight

    // 计算当前章节（每个章节占一个屏幕高度）
    const chapter = Math.floor(scrollTop / windowHeight) + 1
    const newChapter = Math.min(chapter, 4)

    // 只在章节真正改变时更新
    if (newChapter !== currentChapter.value) {
      currentChapter.value = newChapter

      // 标记游戏完成状态
      if (newChapter === 4) {
        localStorage.setItem('gameComplete', 'true')
      }
    }

    scrollTimeout = null
  }, 16) // 约60fps
}

// 章节完成处理
const onChapterComplete = (chapterNumber) => {
  console.log(`第${chapterNumber}章完成`)
  // 可以在这里添加全局状态管理
}

// 组件挂载后的初始化
onMounted(() => {
  // 创建星空效果
  createStars()
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
  overflow-y: auto;
  scroll-behavior: smooth;
  /* 性能优化 */
  will-change: scroll-position;
  transform: translateZ(0); /* 启用硬件加速 */
  -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
}

/* 滚动条样式 */
.chapters-container::-webkit-scrollbar {
  width: 8px;
}

.chapters-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.chapters-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
</style>

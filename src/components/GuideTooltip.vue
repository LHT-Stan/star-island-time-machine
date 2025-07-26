<template>
  <div 
    v-if="visible" 
    class="guide-tooltip"
    :class="[`position-${position}`, { 'with-arrow': showArrow }]"
    :style="tooltipStyle"
  >
    <!-- 箭头指示器 -->
    <div v-if="showArrow" class="arrow-indicator" :class="`arrow-${arrowDirection}`">
      <div class="arrow-pulse">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12L12 2Z" fill="currentColor"/>
        </svg>
      </div>
    </div>
    
    <!-- 气泡内容 -->
    <div class="tooltip-bubble">
      <div class="bubble-content">
        <!-- 图标 -->
        <div v-if="icon" class="tooltip-icon">{{ icon }}</div>
        
        <!-- 文字内容 -->
        <div class="tooltip-text">
          <div v-if="title" class="tooltip-title">{{ title }}</div>
          <div class="tooltip-message">{{ message }}</div>
        </div>
        
        <!-- 关闭按钮 -->
        <button v-if="closable" @click="close" class="close-btn">×</button>
      </div>
      
      <!-- 气泡尾巴 -->
      <div class="bubble-tail" :class="`tail-${position}`"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  message: { type: String, required: true },
  title: { type: String, default: '' },
  icon: { type: String, default: '' },
  position: { type: String, default: 'top' }, // top, bottom, left, right
  showArrow: { type: Boolean, default: true },
  arrowDirection: { type: String, default: 'down' }, // up, down, left, right
  closable: { type: Boolean, default: true },
  autoClose: { type: Number, default: 0 }, // 0表示不自动关闭
  targetElement: { type: String, default: '' }, // CSS选择器
  offset: { type: Object, default: () => ({ x: 0, y: 0 }) }
})

// Emits
const emit = defineEmits(['close', 'click'])

// 响应式状态
const tooltipStyle = ref({})

// 计算样式
const updatePosition = () => {
  if (!props.targetElement) return
  
  const target = document.querySelector(props.targetElement)
  if (!target) return
  
  const rect = target.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
  
  let top = 0
  let left = 0
  
  switch (props.position) {
    case 'top':
      top = rect.top + scrollTop - 60 + props.offset.y
      left = rect.left + scrollLeft + rect.width / 2 + props.offset.x
      break
    case 'bottom':
      top = rect.bottom + scrollTop + 10 + props.offset.y
      left = rect.left + scrollLeft + rect.width / 2 + props.offset.x
      break
    case 'left':
      top = rect.top + scrollTop + rect.height / 2 + props.offset.y
      left = rect.left + scrollLeft - 20 + props.offset.x
      break
    case 'right':
      top = rect.top + scrollTop + rect.height / 2 + props.offset.y
      left = rect.right + scrollLeft + 20 + props.offset.x
      break
  }
  
  tooltipStyle.value = {
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    zIndex: 1000
  }
}

// 关闭提示
const close = () => {
  emit('close')
}

// 自动关闭
let autoCloseTimer = null
const startAutoClose = () => {
  if (props.autoClose > 0) {
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.autoClose)
  }
}

// 生命周期
onMounted(() => {
  updatePosition()
  startAutoClose()
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition)
})

onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition)
})
</script>

<style scoped>
.guide-tooltip {
  position: fixed;
  pointer-events: none;
  z-index: 1000;
}

.guide-tooltip.with-arrow {
  pointer-events: auto;
}

/* 箭头指示器 */
.arrow-indicator {
  position: absolute;
  z-index: 1001;
}

.arrow-pulse {
  animation: arrowPulse 2s ease-in-out infinite;
  color: #FFD700;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
}

@keyframes arrowPulse {
  0%, 100% { 
    transform: scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1.2) rotate(5deg);
    opacity: 1;
  }
}

.arrow-down {
  top: -30px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.arrow-up {
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%) rotate(225deg);
}

.arrow-left {
  right: -30px;
  top: 50%;
  transform: translateY(-50%) rotate(315deg);
}

.arrow-right {
  left: -30px;
  top: 50%;
  transform: translateY(-50%) rotate(135deg);
}

/* 气泡样式 */
.tooltip-bubble {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 194, 239, 0.9) 100%);
  border: 2px solid #8A2BE2;
  border-radius: 15px;
  padding: 12px 16px;
  box-shadow: 0 8px 25px rgba(138, 43, 226, 0.3);
  backdrop-filter: blur(10px);
  max-width: 250px;
  pointer-events: auto;
  animation: bubbleAppear 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bubbleAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.bubble-content {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.tooltip-icon {
  font-size: 20px;
  flex-shrink: 0;
  animation: iconBounce 2s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.tooltip-text {
  flex: 1;
  color: #2E0854;
}

.tooltip-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #8A2BE2;
}

.tooltip-message {
  font-size: 13px;
  line-height: 1.4;
}

.close-btn {
  background: none;
  border: none;
  color: #8A2BE2;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(138, 43, 226, 0.1);
  transform: scale(1.1);
}

/* 气泡尾巴 */
.bubble-tail {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.tail-top {
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 8px 8px 0 8px;
  border-color: #8A2BE2 transparent transparent transparent;
}

.tail-bottom {
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 8px 8px 8px;
  border-color: transparent transparent #8A2BE2 transparent;
}

.tail-left {
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 8px 0 8px 8px;
  border-color: transparent transparent transparent #8A2BE2;
}

.tail-right {
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 8px 8px 8px 0;
  border-color: transparent #8A2BE2 transparent transparent;
}

/* 位置调整 */
.position-top {
  transform: translateX(-50%);
}

.position-bottom {
  transform: translateX(-50%);
}

.position-left {
  transform: translateY(-50%);
}

.position-right {
  transform: translateY(-50%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tooltip-bubble {
    max-width: 200px;
    padding: 10px 12px;
  }
  
  .tooltip-title {
    font-size: 13px;
  }
  
  .tooltip-message {
    font-size: 12px;
  }
  
  .tooltip-icon {
    font-size: 18px;
  }
}
</style>

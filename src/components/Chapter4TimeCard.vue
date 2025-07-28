<template>
  <div class="chapter4" :class="{ active: isActive }">
    <!-- 卷轴贺卡 -->
    <div class="scroll-card" :class="{ unrolling: isUnrolling, unrolled: isUnrolled }">
      <!-- 卷轴装饰 -->
      <div class="scroll-decoration left">
        <div class="unicorn-ornament">🦄</div>
      </div>
      <div class="scroll-decoration right">
        <div class="unicorn-ornament">🦄</div>
      </div>
      
      <!-- 卷轴内容 -->
      <div class="scroll-content" v-if="isUnrolled">
        <!-- 中央照片 -->
        <div class="center-photo">
          <img src="../assets/images/her.jpg" alt="生日女孩" />
          <div class="photo-decorations">
            <div class="cat-ears">😺</div>
            <div class="unicorn-horn">🦄</div>
          </div>
        </div>
        
        <!-- 祝福文字 -->
        <div class="blessing-text" :class="{ appearing: showText }">
          <h2>亲爱的小朋友：</h2>
          <p>感谢1430个日夜的星光同行，</p>
          <p>愿往后的每个黎明，</p>
          <p>都有臭臭偷走你的零食，</p>
          <p>有悟空守护你的愿望，</p>
          <p>而我...永远负责把你宠成小朋友！</p>
          <div class="signature">
            <p>万事顺遂，平平安安</p>
            <p class="date">{{ currentDate }}</p>
          </div>
        </div>
        
        <!-- 环绕元素 */
        <div class="floating-elements" v-if="showElements">
          <div class="element dragon-egg">🥚</div>
          <div class="element paw-print">🐾</div>
          <div class="element snack">🍿</div>
          <div class="element star">⭐</div>
          <div class="element heart">💖</div>
        </div>
        
        <!-- 语音播放按钮 -->
        <div class="voice-player" v-if="canPlayVoice">
          <div 
            class="unicorn-horn-btn" 
            @click="playVoiceMessage"
            :class="{ playing: isPlaying }"
          >
            <div class="horn-icon">🦄</div>
            <div class="play-hint">点击独角兽角播放祝福</div>
          </div>
          
          <!-- 声波动画 -->
          <div v-if="isPlaying" class="sound-waves">
            <div class="wave" v-for="i in 5" :key="i"></div>
          </div>
        </div>
      </div>
      
      <!-- 触发提示 -->
      <div v-if="!isUnrolling && !isUnrolled" class="trigger-hint" @click="startUnroll">
        轻触开启祝福
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Props
const props = defineProps({
  isActive: Boolean
})

// Emits
const emit = defineEmits(['chapter-complete'])

// 响应式状态
const isUnrolling = ref(false)
const isUnrolled = ref(false)
const showText = ref(false)
const showElements = ref(false)
const isPlaying = ref(false)

// 计算属性
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// 检查是否可以播放语音（基于游戏完成状态）
const canPlayVoice = computed(() => {
  // 这里可以检查localStorage中的游戏完成状态
  return localStorage.getItem('gameComplete') === 'true'
})

// 开始展开卷轴
const startUnroll = () => {
  if (isUnrolling.value || isUnrolled.value) return
  
  isUnrolling.value = true
  
  // 展开动画持续3秒
  setTimeout(() => {
    isUnrolling.value = false
    isUnrolled.value = true
    
    // 依次显示内容
    setTimeout(() => {
      showText.value = true
    }, 500)
    
    setTimeout(() => {
      showElements.value = true
    }, 1500)
    
    // 标记章节完成
    emit('chapter-complete', 4)
  }, 3000)
}

// 播放语音祝福（增强错误处理）
const playVoiceMessage = () => {
  if (!canPlayVoice.value || isPlaying.value) return

  isPlaying.value = true

  // 检查语音合成支持
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    console.log('浏览器不支持语音合成，使用备用方案')
    playBackupVoice()
    return
  }

  try {
    // 创建语音合成（Text-to-Speech）
    const utterance = new SpeechSynthesisUtterance()
    utterance.text = "亲爱的小朋友，感谢1430个日夜的星光同行，愿往后的每个黎明，都有臭臭偷走你的零食，有悟空守护你的愿望，而我永远负责把你宠成小朋友！万事顺遂，平平安安！"
    utterance.lang = 'zh-CN'
    utterance.rate = 0.8 // 语速
    utterance.pitch = 1.1 // 音调
    utterance.volume = 0.8 // 音量

    // 语音结束回调
    utterance.onend = () => {
      isPlaying.value = false
    }

    // 语音错误回调
    utterance.onerror = (event) => {
      isPlaying.value = false
      console.log('语音播放失败:', event.error)
      playBackupVoice()
    }

    // 检查语音合成状态
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
    }

    // 开始播放
    speechSynthesis.speak(utterance)

    // 设置超时保护
    setTimeout(() => {
      if (isPlaying.value) {
        speechSynthesis.cancel()
        isPlaying.value = false
        console.log('语音播放超时，已停止')
      }
    }, 30000) // 30秒超时

  } catch (error) {
    console.log('语音合成初始化失败:', error)
    isPlaying.value = false
    playBackupVoice()
  }
}

// 备用语音播放（使用Web Audio API生成音调）
const playBackupVoice = () => {
  try {
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.log('浏览器不支持Web Audio API')
      isPlaying.value = false
      return
    }

    const audioContext = new (window.AudioContext || window.webkitAudioContext)()

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    // 生日快乐歌的简化版音符
    const melody = [
      { freq: 523, duration: 0.5 }, // C
      { freq: 523, duration: 0.5 }, // C
      { freq: 587, duration: 1.0 }, // D
      { freq: 523, duration: 1.0 }, // C
      { freq: 698, duration: 1.0 }, // F
      { freq: 659, duration: 2.0 }, // E
      { freq: 523, duration: 0.5 }, // C
      { freq: 523, duration: 0.5 }, // C
      { freq: 587, duration: 1.0 }, // D
      { freq: 523, duration: 1.0 }, // C
      { freq: 784, duration: 1.0 }, // G
      { freq: 698, duration: 2.0 }  // F
    ]

    let currentTime = audioContext.currentTime

    melody.forEach((note) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(note.freq, currentTime)
      gainNode.gain.setValueAtTime(0.3, currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration - 0.1)

      oscillator.start(currentTime)
      oscillator.stop(currentTime + note.duration)

      currentTime += note.duration
    })

    setTimeout(() => {
      isPlaying.value = false
    }, currentTime * 1000 + 500)

  } catch (error) {
    console.log('备用音效播放失败:', error)
    isPlaying.value = false
  }
}

// 监听章节激活状态
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    console.log('第四章：时光贺卡 已激活')
  }
})

// 组件挂载
onMounted(() => {
  console.log('第四章：时光贺卡 已加载')
})
</script>

<style scoped>
.chapter4 {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.5s ease;
}

.chapter4.active {
  opacity: 1;
}

/* 卷轴贺卡 */
.scroll-card {
  position: relative;
  width: 600px;
  height: 400px;
  background: linear-gradient(135deg, #F5F5DC 0%, #FFFACD 100%);
  border: 4px solid #8B4513;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s ease;
  overflow: hidden;
}

.scroll-card:not(.unrolled):hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* 卷轴展开动画 */
.scroll-card.unrolling {
  animation: scrollUnroll 3s ease-out forwards;
}

@keyframes scrollUnroll {
  0% {
    clip-path: polygon(45% 0%, 55% 0%, 55% 100%, 45% 100%);
  }
  100% {
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  }
}

/* 卷轴装饰 */
.scroll-decoration {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 100%;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.scroll-decoration.left {
  left: -30px;
  border-radius: 30px 0 0 30px;
}

.scroll-decoration.right {
  right: -30px;
  border-radius: 0 30px 30px 0;
}

.unicorn-ornament {
  font-size: 24px;
  animation: ornamentGlow 2s ease-in-out infinite;
}

@keyframes ornamentGlow {
  0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5)); }
  50% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.9)); }
}

/* 卷轴内容 */
.scroll-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 中央照片 */
.center-photo {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  animation: photoAppear 1s ease-out;
}

@keyframes photoAppear {
  0% { opacity: 0; transform: scale(0.5); }
  100% { opacity: 1; transform: scale(1); }
}

.center-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #FFD700;
  filter: brightness(1.1) saturate(1.15);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}

.photo-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cat-ears {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
}

.unicorn-horn {
  position: absolute;
  top: -15px;
  right: 10px;
  font-size: 16px;
  transform: rotate(45deg);
}

/* 祝福文字 */
.blessing-text {
  color: #2E0854;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out;
}

.blessing-text.appearing {
  opacity: 1;
  transform: translateY(0);
}

.blessing-text h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #8A2BE2;
  text-shadow: 0 0 8px rgba(138, 43, 226, 0.3);
}

.blessing-text p {
  font-size: 14px;
  margin-bottom: 8px;
}

.signature {
  margin-top: 20px;
  font-style: italic;
}

.signature .date {
  color: #8A2BE2;
  font-weight: bold;
}

/* 环绕元素 */
.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.element {
  position: absolute;
  font-size: 20px;
  animation: elementFloat 4s ease-in-out infinite;
}

.element.dragon-egg {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.element.paw-print {
  top: 30%;
  right: 15%;
  animation-delay: 1s;
}

.element.snack {
  bottom: 30%;
  left: 15%;
  animation-delay: 2s;
}

.element.star {
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

.element.heart {
  top: 50%;
  left: 5%;
  animation-delay: 0.5s;
}

@keyframes elementFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

/* 语音播放器 */
.voice-player {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.unicorn-horn-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unicorn-horn-btn:hover {
  transform: scale(1.1);
}

.horn-icon {
  font-size: 32px;
  margin-bottom: 5px;
}

.play-hint {
  font-size: 12px;
  color: #8A2BE2;
  text-align: center;
}

.unicorn-horn-btn.playing .horn-icon {
  animation: hornPulse 1s ease-in-out infinite;
}

@keyframes hornPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 声波动画 */
.sound-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.wave {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid #8A2BE2;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: waveExpand 2s ease-out infinite;
}

.wave:nth-child(2) { animation-delay: 0.4s; }
.wave:nth-child(3) { animation-delay: 0.8s; }
.wave:nth-child(4) { animation-delay: 1.2s; }
.wave:nth-child(5) { animation-delay: 1.6s; }

@keyframes waveExpand {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}

/* 触发提示 */
.trigger-hint {
  color: #8A2BE2;
  font-size: 18px;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.8);
  animation: hintPulse 2s ease-in-out infinite;
}

@keyframes hintPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .scroll-card {
    width: 90%;
    height: 300px;
  }
  
  .scroll-content {
    padding: 20px;
  }
  
  .center-photo {
    width: 80px;
    height: 80px;
  }
  
  .blessing-text h2 {
    font-size: 16px;
  }
  
  .blessing-text p {
    font-size: 12px;
  }
  
  .element {
    font-size: 16px;
  }
}
</style>

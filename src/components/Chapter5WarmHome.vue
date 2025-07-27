<template>
  <div class="warm-home-container">
    <!-- 房间背景场景 -->
    <div class="room-scene">
      <!-- 主背景图片 -->
      <img
        :src="roomImageUrl"
        alt="温馨房间"
        class="room-background"
        @load="onBackgroundLoaded"
      >

      <!-- 精灵叠加层 -->
      <div class="sprites-layer">
        <!-- 狸花猫臭臭 - 双图层叠加 -->
        <div class="cat-container" @click="interactWithCat">
          <img
            :src="catImageUrl"
            alt="臭臭睡觉"
            class="cat-sprite cat-sleep"
            :class="{ 'cat-fade-out': catAwake }"
          >
          <img
            :src="catStretchImageUrl"
            alt="臭臭伸懒腰"
            class="cat-sprite cat-stretch"
            :class="{ 'cat-fade-in': catAwake }"
          >
        </div>

        <!-- 电脑顶部装饰 -->
        <!-- <img
          :src="computerTopImageUrl"
          alt="电脑顶部"
          class="computer-top"
        > -->

        <!-- 生日贺卡 -->
        <img
          :src="birthdayCardImageUrl"
          alt="生日贺卡"
          class="birthday-card"
          @click="showCardCreation"
          @mouseenter="showHint('点击查看生日贺卡')"
          @mouseleave="hideHint"
        >

        <!-- 礼盒 -->
        <img
          :src="giftboxImageUrl"
          alt="零食收藏礼盒"
          class="giftbox"
          @click="showSnackCollection"
          @mouseenter="showHint('打开礼盒查看收藏')"
          @mouseleave="hideHint"
        >

        <!-- 悟空精灵 -->
        <img
          :src="wukongImageUrl"
          alt="悟空守护精灵"
          class="wukong-spirit"
          :class="{ 'spirit-glow': wukongGlowing }"
          @click="showWukongMemory"
        >

        <!-- 背景照片装饰 -->
        <img :src="photoWallMe" alt="白夜" class="background-photo photo-me" @click="handlePhotoClick('me')">
        <img :src="photoWallFeier1" alt="菲儿" class="background-photo photo-feier1" @click="handlePhotoClick('feier')">
        <img :src="photoWallFeier2" alt="菲儿" class="background-photo photo-feier2" @click="handlePhotoClick('feier')">
        <img :src="photoWallChouchou" alt="臭臭" class="background-photo photo-chouchou" @click="handlePhotoClick('chouchou')">
        <img :src="photoWallWukong" alt="悟空" class="background-photo photo-wukong" @click="handlePhotoClick('wukong')">
        <img :src="photoWallTogether" alt="温馨时光" class="background-photo photo-together" @click="handlePhotoClick('together')"
      </div>

      <!-- 数字0显示区域 -->
      <div v-if="showNumber0 && !number0Collected && shouldShowNumber0"
           class="number-display number-0"
           @click="handleNumber0Click">
        <span class="number-reflection">0</span>
      </div>

      <!-- 信件查看入口 -->
      <div class="letter-access-btn" @click="openLetterMenu" v-if="letterUnlockStatus.wukongLetterUnlocked || letterUnlockStatus.developerLetterUnlocked">
        <div class="letter-icon">💌</div>
        <div class="letter-text">查看信件</div>
      </div>

      <!-- 提示气泡 -->
      <div 
        class="hint-bubble" 
        v-if="currentHint"
        :style="hintPosition"
      >
        {{ currentHint }}
      </div>
    </div>
    
    <!-- 贺卡展示模态框 -->
    <Teleport to="body">
      <div class="card-modal" v-if="showCard" @click="closeCard">
      <div class="card-content" @click.stop>
        <div class="card-scroll">
          <div class="card-header">
            <h2>💝 致亲爱的菲儿</h2>
          </div>
          <div class="card-body">
            <div class="friend-photo">
              <img :src="friendImageUrl" alt="菲儿" class="photo">
              <div class="photo-decoration">🦄✨</div>
            </div>
            <div class="blessing-text">
              <p>感谢这么多个日夜的星光同行，</p>
              <p>从ARK的仙境一起抓独角兽，</p>
              <p>到偷偷摸摸去偷飞龙蛋的刺激冒险，</p>
              <p>在永劫无间的江湖里看风景打打杀杀，</p>
              <p>每一个游戏世界都有我们的足迹。</p>
              <p>愿往后的每个黎明，</p>
              <p>都有臭臭陪你分享小零食，</p>
              <p>有悟空守护你的愿望，</p>
              <p>有我们一起开黑到深夜，</p>
              <p>而我...永远负责把你宠成小朋友！</p>
              <div class="signature">💜 白夜</div>
            </div>
          </div>
        </div>
        <button class="close-btn" @click="closeCard">×</button>
      </div>
    </div>
    </Teleport>
    
    <!-- 零食收藏模态框 -->
    <Teleport to="body">
      <div class="collection-modal" v-if="showCollection" @click="closeCollection">
      <div class="collection-content" @click.stop>
        <h3>🎁 零食收藏盒</h3>
        <p class="collection-description">这里收藏着从星愿转盘抽到的珍贵礼物，每一样都承载着美好的愿望～</p>

        <!-- 有收藏时显示卡片 -->
        <div v-if="collectedCards.length > 0" class="cards-grid">
          <div
            v-for="card in collectedCards"
            :key="card.id"
            class="card-item"
            :class="card.rarity"
          >
            <div class="card-icon">{{ card.icon }}</div>
            <div class="card-name">{{ card.name }}</div>
            <div class="card-description">{{ card.description }}</div>
            <div class="card-quantity" v-if="card.quantity > 1">x{{ card.quantity }}</div>
            <div class="card-source">{{ card.name }}一张，可以向帅帅的白夜兑换奖品哟</div>
          </div>
        </div>

        <!-- 空状态显示 -->
        <div v-else class="empty-collection">
          <div class="empty-icon">🎁</div>
          <p class="empty-text">礼盒还是空的呢</p>
          <p class="empty-hint">去第四章"白夜的星愿转盘"抽取礼物吧！</p>
        </div>
        <button class="close-btn" @click="closeCollection">×</button>
      </div>
    </div>
    </Teleport>
    
    <!-- 悟空回忆模态框 -->
    <Teleport to="body">
      <div class="memory-modal" v-if="showMemory" @click="closeMemory">
      <div class="memory-content" @click.stop>
        <div class="memory-header">
          <h3>👻 悟空的守护</h3>
        </div>
        <div class="memory-body">
          <div class="wukong-photo">
            <img :src="wukongImageUrl" alt="悟空" class="memory-photo">
            <div class="spirit-effect"></div>
          </div>
          <div class="memory-text">
            <p>"我在彩虹桥这边很好，</p>
            <p>每天追着发光的蝴蝶...</p>
            <p>你要记得照顾好自己，</p>
            <p>还有那只贪嘴的小臭臭。</p>
            <p>我会一直守护着你们的。"</p>
            <div class="paw-print">🐾</div>
          </div>
        </div>
        <button class="close-btn" @click="closeMemory">×</button>
      </div>
    </div>
    </Teleport>

    <!-- 信件查看菜单 -->
    <Teleport to="body">
      <div v-if="showLetterMenu" class="letter-menu-modal" @click="closeLetterMenu">
        <div class="letter-menu-content" @click.stop>
          <button class="close-btn" @click="closeLetterMenu">×</button>
          <div class="menu-header">
            <h3>💌 信件收藏</h3>
            <p>重新查看珍贵的回忆</p>
          </div>
          <div class="menu-options">
            <button
              v-if="letterUnlockStatus.wukongLetterUnlocked"
              class="letter-option wukong-option"
              @click="openWukongLetter"
            >
              <div class="option-icon">👻</div>
              <div class="option-text">
                <h4>悟空的秘密信件</h4>
                <p>来自彩虹桥的守护</p>
              </div>
            </button>

            <button
              v-if="letterUnlockStatus.developerLetterUnlocked"
              class="letter-option developer-option"
              @click="openDeveloperLetter"
            >
              <div class="option-icon">💻</div>
              <div class="option-text">
                <h4>开发者的信件</h4>
                <p>用代码编织的祝福</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 悟空信件重新查看 -->
    <Teleport to="body">
      <div v-if="showWukongLetterReview" class="wukong-letter-modal" @click="closeWukongLetter">
        <div class="wukong-letter-content" @click.stop>
          <button class="close-btn" @click="closeWukongLetter">×</button>
          <div class="wukong-header">
            <div class="wukong-avatar">👻</div>
            <h3>悟空的秘密信件</h3>
            <p class="wukong-subtitle">来自彩虹桥的守护精灵</p>
          </div>
          <div class="wukong-body">
            <div class="wukong-text">
              <p class="greeting">我最爱的小主人：</p>
              <p>虽然我已经去了彩虹桥，但我一直在守护着你...</p>
              <p>每当夜晚降临，我就会化作星光，在你的梦中奔跑。看到你和臭臭一起玩耍，我就知道你过得很好。</p>
              <p>我们还记得我们在一起的时光？你总是给我最好的食物，最温暖的拥抱。那些日子是我最快乐的时光。</p>
              <p>现在的我在彩虹桥这边很好，每天追着发光的蝴蝶，和其他小伙伴一起玩耍。但我最想念的，还是你的笑声。</p>
              <p>请不要为我难过，因为爱是永恒的。我会一直在星空中守护你，直到我们在彩虹桥重逢的那一天。</p>
              <p>要好好照顾自己，也要好好照顾臭臭。记住，无论何时，只要你抬头看星空，我就在那里。</p>
              <p class="signature">永远爱你的守护精灵<br>悟空 🌟</p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 返回按钮 -->
    <div class="prev-navigation-button">
      <button @click="goToPrevChapter" class="prev-chapter-btn">
        ← 上一章
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from 'vue'
import numberCollector from '../utils/numberCollector.js'
import roomImageUrl from '../assets/images/room.jpg'
import catImageUrl from '../assets/images/chouchou_cat1.png'
import catStretchImageUrl from '../assets/images/chouhcou_cat2.png'
import computerTopImageUrl from '../assets/images/computer-top.png'
import birthdayCardImageUrl from '../assets/images/card.jpg'
import giftboxImageUrl from '../assets/images/giftbox.png'
import wukongImageUrl from '../assets/images/wukong_dog.png'
import friendImageUrl from '../assets/images/baiye.jpg'

// 照片墙图片导入
import photoWallMe from '../assets/images/photo-wall/me.jpg'
import photoWallFeier1 from '../assets/images/photo-wall/feir1.jpg'
import photoWallFeier2 from '../assets/images/photo-wall/ferer2.jpg'
import photoWallChouchou from '../assets/images/photo-wall/chouchou.jpg'
import photoWallWukong from '../assets/images/photo-wall/wukong.jpg'
import photoWallTogether from '../assets/images/photo-wall/feierandchouchou.jpg'

export default {
  name: 'Chapter5WarmHome',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ['prev-chapter'],
  setup(props, { emit }) {
    // 数字收集系统 - 第五章数字0
    const showNumber0 = ref(false)
    const number0Collected = ref(false)
    const photoClickSequence = ref([])
    const correctSequence = ['me', 'feier', 'chouchou']  // 小星 → 菲儿 → 臭臭

    // 检查是否应该显示数字0（基于收集顺序）
    const shouldShowNumber0 = computed(() => {
      return numberCollector.shouldShowNumber(5, 0)
    })

    // 信件解锁状态计算属性
    const letterUnlockStatus = computed(() => {
      return checkLetterUnlockStatus()
    })

    // 信件查看系统
    const showLetterMenu = ref(false)
    const showWukongLetterReview = ref(false)
    const showDeveloperLetterReview = ref(false)

    // 响应式状态
    const backgroundLoaded = ref(false)
    const catAwake = ref(false)
    const wukongGlowing = ref(false)
    const screenGlowing = ref(true)
    const giftSparkle = ref(true)
    
    // 模态框状态
    const showCard = ref(false)
    const showCollection = ref(false)
    const showMemory = ref(false)
    
    // 提示系统
    const currentHint = ref('')
    const hintPosition = reactive({ top: '0px', left: '0px' })
    
    // 收集的卡片数据
    const collectedCards = ref([])


    
    // 生命周期
    onMounted(() => {
      loadCollectedCards()
      startAmbientAnimations()
    })

    // 监听localStorage变化，实时更新收藏数据
    const handleStorageChange = () => {
      loadCollectedCards()
    }

    // 添加storage事件监听
    onMounted(() => {
      window.addEventListener('storage', handleStorageChange)
    })

    onUnmounted(() => {
      window.removeEventListener('storage', handleStorageChange)
    })

    // 监听章节激活状态，重新加载数据
    watch(() => props.isActive, (newVal) => {
      if (newVal) {
        // 章节激活时重新加载数据
        setTimeout(() => {
          loadCollectedCards()
        }, 100)
      }
    })
    
    // 方法定义
    const onBackgroundLoaded = () => {
      backgroundLoaded.value = true
    }
    
    const loadCollectedCards = () => {
      // 从localStorage加载第四章抽奖获得的礼物卡片
      const saved = localStorage.getItem('starWishWheel_gameData')
      if (saved) {
        try {
          const gameData = JSON.parse(saved)
          if (gameData.cards && Array.isArray(gameData.cards)) {
            // 转换第四章卡片格式为收藏展示格式
            collectedCards.value = gameData.cards.map(card => ({
              id: card.uniqueId,
              name: card.name,
              icon: card.icon,
              rarity: card.rarity,
              description: card.description,
              source: '第四章 白夜的星愿转盘',
              obtainedAt: card.obtainedAt,
              quantity: card.quantity || 1
            }))
          }
        } catch (error) {
          console.error('解析第四章数据失败:', error)
        }
      }
      // 如果没有数据，保持空数组，显示空状态
    }
    
    const startAmbientAnimations = () => {
      // 屏幕发光动画
      setInterval(() => {
        screenGlowing.value = !screenGlowing.value
      }, 3000)

      // 礼盒闪烁动画
      setInterval(() => {
        giftSparkle.value = !giftSparkle.value
      }, 4000)
    }

    // 贺卡打开音效 - 温馨和弦
    const playCardOpenSound = (audioContext) => {
      const frequencies = [523.25, 659.25, 783.99] // C-E-G和弦

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)

          oscillator.start()
          oscillator.stop(audioContext.currentTime + 1.2)
        }, index * 200)
      })
    }

    // 礼盒打开音效 - 惊喜上升音调
    const playGiftOpenSound = (audioContext) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.8)
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 1.2)

      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1.2)
    }

    // 猫咪伸懒腰音效 - 可爱的上升音调
    const playCatStretchSound = (audioContext) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.3)
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.6)
      oscillator.frequency.exponentialRampToValueAtTime(500, audioContext.currentTime + 1.0)

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1.0)
    }

    // 猫咪呼噜声音效 - 温柔的低频震动
    const playCatPurrSound = (audioContext) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.5)
      oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 1.0)

      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0)

      oscillator.start()
      oscillator.stop(audioContext.currentTime + 1.0)
    }

    // 悟空精灵音效 - 神秘的铃铛声
    const playSpiritChimeSound = (audioContext) => {
      const frequencies = [1047, 1319, 1568] // C-E-G高音

      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
          gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)

          oscillator.start()
          oscillator.stop(audioContext.currentTime + 1.5)
        }, index * 300)
      })
    }
    
    const showHint = (text) => {
      currentHint.value = text
    }
    
    const hideHint = () => {
      currentHint.value = ''
    }
    
    const showCardCreation = () => {
      showCard.value = true
      document.body.style.overflow = 'hidden'  // 锁定背景滚动
      playSound('card-open')
    }
    
    const closeCard = () => {
      showCard.value = false
      document.body.style.overflow = 'auto'  // 恢复背景滚动
    }
    
    const showSnackCollection = () => {
      // 打开礼盒前重新加载最新数据
      loadCollectedCards()

      showCollection.value = true
      document.body.style.overflow = 'hidden'  // 锁定背景滚动
      playSound('gift-open')
    }
    
    const closeCollection = () => {
      showCollection.value = false
      document.body.style.overflow = 'auto'  // 恢复背景滚动
    }
    
    const interactWithCat = () => {
      if (catAwake.value) return // 防止重复点击

      catAwake.value = true
      playSound('cat-stretch')

      // 优化时序：3.5秒后恢复睡觉状态
      setTimeout(() => {
        catAwake.value = false
        playSound('cat-purr') // 回到睡觉时播放呼噜声
      }, 3500)
    }
    
    const showWukongMemory = () => {
      wukongGlowing.value = true
      showMemory.value = true
      document.body.style.overflow = 'hidden'  // 锁定背景滚动
      playSound('spirit-chime')
    }
    
    const closeMemory = () => {
      showMemory.value = false
      wukongGlowing.value = false
      document.body.style.overflow = 'auto'  // 恢复背景滚动
    }


    
    const playSound = (soundType) => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        switch (soundType) {
          case 'card-open':
            // 贺卡打开 - 温馨的和弦音效
            playCardOpenSound(audioContext)
            break
          case 'gift-open':
            // 礼盒打开 - 惊喜的上升音调
            playGiftOpenSound(audioContext)
            break
          case 'cat-stretch':
            // 猫咪伸懒腰 - 可爱的上升音调
            playCatStretchSound(audioContext)
            break
          case 'cat-purr':
            // 猫咪呼噜声 - 温柔的低频震动
            playCatPurrSound(audioContext)
            break
          case 'spirit-chime':
            // 悟空精灵 - 神秘的铃铛声
            playSpiritChimeSound(audioContext)
            break
          default:
            console.log(`未知音效类型: ${soundType}`)
        }
      } catch (error) {
        console.log(`音效播放失败 (${soundType}):`, error)
      }
    }

    // 照片点击处理 - 数字收集彩蛋
    const handlePhotoClick = (photoType) => {
      if (number0Collected.value) return

      photoClickSequence.value.push(photoType)
      console.log(`照片点击序列: ${photoClickSequence.value.join(' → ')}`)

      // 检查序列是否正确
      const currentSequence = photoClickSequence.value.join(',')
      const targetSequence = correctSequence.join(',')

      if (currentSequence === targetSequence) {
        // 序列正确，显示数字0
        showNumber0.value = true
        console.log('✨ 照片点击序列正确！数字0解锁！')

        // 重置序列
        photoClickSequence.value = []
      } else if (photoClickSequence.value.length >= correctSequence.length) {
        // 序列错误，重置
        photoClickSequence.value = []
        console.log('❌ 照片点击序列错误，已重置')
      }
    }

    // 数字0点击处理
    const handleNumber0Click = () => {
      if (!showNumber0.value || number0Collected.value) return

      const success = numberCollector.collectNumber(5, 0, 'photo_combination')
      if (success) {
        number0Collected.value = true
        showNumber0.value = false
        console.log('🎉 成功收集数字0!')

        // 显示收集成功提示
        showHint('一串神秘的数字，似乎代表了什么意义。')
      }
    }

    // 检测信件解锁状态
    const checkLetterUnlockStatus = () => {
      // 检查是否触发过悟空信件（第二章彩蛋）
      const wukongLetterUnlocked = localStorage.getItem('wukongLetterUnlocked') === 'true'

      // 检查是否收集完所有数字（开发者信件）
      const numberCollectorData = JSON.parse(localStorage.getItem('starIsland_numberCollection') || '{}')
      const allNumbersCollected = numberCollectorData.collectedNumbers?.length >= 6

      console.log('🔍 检测信件解锁状态:', {
        wukongLetterUnlocked,
        numberCollectorData,
        allNumbersCollected
      })

      return {
        wukongLetterUnlocked,
        developerLetterUnlocked: allNumbersCollected
      }
    }

    // 信件查看相关函数
    const openLetterMenu = () => {
      showLetterMenu.value = true
    }

    const closeLetterMenu = () => {
      showLetterMenu.value = false
    }

    const openWukongLetter = () => {
      showWukongLetterReview.value = true
      showLetterMenu.value = false
    }

    const closeWukongLetter = () => {
      showWukongLetterReview.value = false
    }

    const openDeveloperLetter = () => {
      // 触发全局开发者信件显示
      window.dispatchEvent(new CustomEvent('showDeveloperLetter', {
        detail: {
          manualTrigger: true,
          timestamp: Date.now()
        }
      }))
      showLetterMenu.value = false
    }

    // 返回上一章（发射事件给父组件）
    const goToPrevChapter = () => {
      console.log('🔙 返回第四章')
      emit('prev-chapter')
    }

    return {
      // 状态
      backgroundLoaded,
      catAwake,
      wukongGlowing,
      screenGlowing,
      giftSparkle,
      showCard,
      showCollection,
      showMemory,
      currentHint,
      hintPosition,
      collectedCards,

      // 图片资源
      roomImageUrl,
      catImageUrl,
      catStretchImageUrl,
      computerTopImageUrl,
      birthdayCardImageUrl,
      giftboxImageUrl,
      wukongImageUrl,
      friendImageUrl,

      // 方法
      onBackgroundLoaded,
      showHint,
      hideHint,
      showCardCreation,
      closeCard,
      showSnackCollection,
      closeCollection,
      interactWithCat,
      showWukongMemory,
      closeMemory,

      // 照片资源
      photoWallMe,
      photoWallFeier1,
      photoWallFeier2,
      photoWallChouchou,
      photoWallWukong,
      photoWallTogether,

      // 数字收集相关
      showNumber0,
      number0Collected,
      shouldShowNumber0,
      handlePhotoClick,
      handleNumber0Click,

      // 信件查看相关
      showLetterMenu,
      showWukongLetterReview,
      showDeveloperLetterReview,
      checkLetterUnlockStatus,
      letterUnlockStatus,
      openLetterMenu,
      closeLetterMenu,
      openWukongLetter,
      closeWukongLetter,
      openDeveloperLetter,

      // 导航
      goToPrevChapter
    }
  }
}
</script>

<style scoped>
.warm-home-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #2a0845 0%, #8a2be2 100%);
  z-index: 1;  /* 确保容器有基础层级 */
}

.room-scene {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2a0845 0%, #8a2be2 100%);
}

.room-background {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* 精灵叠加层 */
.sprites-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* 猫咪容器 */
.cat-container {
  position: absolute;
  top: 48%;
  left: 0%;
  width: 200px;
  height: 200px;
  cursor: pointer;
  pointer-events: auto;
}

.cat-sprite {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.8s ease-in-out;
}

/* 睡觉状态 */
.cat-sleep {
  opacity: 1;
  z-index: 1;
  animation: catSleep 4s ease-in-out infinite, wiggle 8s ease-in-out infinite;
}

/* 伸懒腰状态 */
.cat-stretch {
  opacity: 0;
  z-index: 2;
  /* 固定位置和角度调整 - 您可以修改这些数值 */
  position: absolute;

  top: -16px;    /* 相对于容器的垂直偏移 */
  left: 0px;     /* 相对于容器的水平偏移 */
  transform: rotate(-5deg);  /* 旋转角度，您可以修改如 -10deg, 15deg 等 */
}

/* 切换动画 */
.cat-fade-out {
  opacity: 0;
}

.cat-fade-in {
  opacity: 1;
  animation: stretchEffect 0.8s ease-out;
}

/* 电脑顶部装饰 */
.computer-top {
  position: absolute;
  top: 38%;        /* 您可以修改这个数值调整垂直位置 */
  left: 0%;       /* 您可以修改这个数值调整水平位置 */
  width: 128x;    /* 您可以修改这个数值调整宽度 */
  height: 60px;    /* 您可以修改这个数值调整高度 */
  pointer-events: none;  /* 不阻挡其他元素的点击 */
  z-index: 1;
}

/* 生日贺卡 */
.birthday-card {
  position: absolute;
  top: 42%;        /* 您可以修改这个数值调整垂直位置 */
  left: 6%;       /* 您可以修改这个数值调整水平位置 */
  width: 120px;    /* 您可以修改这个数值调整宽度 */
  height: 90px;    /* 您可以修改这个数值调整高度 */
  cursor: pointer; /* 可点击指针 */
  pointer-events: auto;  /* 允许点击事件 */
  z-index: 2;
  animation: cardWiggle 5s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.birthday-card:hover {
  transform: scale(1.08);
  animation-duration: 2s; /* 悬停时加快动画 */
}

/* 礼盒 */
.giftbox {
  position: absolute;
  bottom: 3%;     /* 您可以修改这个数值调整垂直位置 */
  left: 5%;       /* 您可以修改这个数值调整水平位置 */
  width: 100px;    /* 您可以修改这个数值调整宽度 */
  height: 100px;   /* 您可以修改这个数值调整高度 */
  cursor: pointer; /* 可点击指针 */
  pointer-events: auto;  /* 允许点击事件 */
  z-index: 2;
  animation: giftWiggle 6s ease-in-out infinite;
  transition: transform 0.3s ease;
}

.giftbox:hover {
  transform: scale(1.12);
  animation-duration: 2.5s; /* 悬停时加快动画 */
}

.wukong-spirit {
  position: absolute;
  top: 34%;
  left: 0%;
  width: 70px;
  height: 70px;
  opacity: 0.8;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  animation: wukongGlow 7s ease-in-out infinite;
}

.wukong-spirit:hover {
  animation-duration: 3s; /* 悬停时加快发光动画 */
}

.wukong-spirit.spirit-glow {
  opacity: 1;
  filter: brightness(1.3) drop-shadow(0 0 10px #00ffff);
}

/* 数字显示样式 */
.number-display {
  position: absolute;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  animation: homeGlow 2s ease-in-out infinite;
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

/* 数字0的位置 */
.number-0 {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes homeGlow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 信件查看入口 */
.letter-access-btn {
  position: absolute;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #8A2BE2 0%, #4B0082 100%);
  border: 2px solid #FFD700;
  border-radius: 15px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
}

.letter-access-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 43, 226, 0.5);
}

.letter-icon {
  font-size: 20px;
  animation: letterFloat 2s ease-in-out infinite;
}

.letter-text {
  color: #FFD700;
  font-size: 14px;
  font-weight: bold;
}

@keyframes letterFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 信件菜单弹窗 */
.letter-menu-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  animation: modalAppear 0.3s ease-out;
}

.letter-menu-content {
  background: linear-gradient(135deg, #2E0854 0%, #4B0082 50%, #8A2BE2 100%);
  border: 3px solid #FFD700;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: menuSlideUp 0.5s ease-out;
}

.menu-header {
  text-align: center;
  margin-bottom: 25px;
  color: white;
}

.menu-header h3 {
  margin: 0 0 8px 0;
  color: #FFD700;
  font-size: 24px;
}

.menu-header p {
  margin: 0;
  color: #FFC2EF;
  font-size: 14px;
  opacity: 0.9;
}

.menu-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.letter-option {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  color: white;
}

.letter-option:hover {
  border-color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-2px);
}

.option-icon {
  font-size: 30px;
  min-width: 40px;
}

.option-text h4 {
  margin: 0 0 5px 0;
  color: #FFD700;
  font-size: 16px;
}

.option-text p {
  margin: 0;
  color: #FFC2EF;
  font-size: 12px;
  opacity: 0.8;
}

/* 悟空信件重新查看 */
.wukong-letter-modal {
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

.wukong-letter-content {
  background: linear-gradient(135deg, #1a0033 0%, #2d1b69 50%, #8A2BE2 100%);
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

.wukong-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #FFD700;
}

.wukong-avatar {
  font-size: 50px;
  margin-bottom: 15px;
  animation: spiritGlow 3s ease-in-out infinite;
}

@keyframes spiritGlow {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
  }
}

.wukong-header h3 {
  margin: 0 0 8px 0;
  color: #FFD700;
  font-size: 26px;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
}

.wukong-subtitle {
  margin: 0;
  color: #FFC2EF;
  font-size: 14px;
  opacity: 0.9;
  font-style: italic;
}

.wukong-body {
  margin-bottom: 25px;
}

.wukong-text {
  color: #E6E6FA;
  font-size: 16px;
  line-height: 1.8;
}

.wukong-text p {
  margin-bottom: 18px;
  animation: textAppear 1s ease-out;
}

.wukong-text .greeting {
  font-weight: bold;
  color: #FFD700 !important;
  font-size: 18px !important;
}

.wukong-text .signature {
  text-align: right;
  font-style: italic;
  color: #FFD700 !important;
  font-weight: bold;
  margin-top: 25px !important;
}

@keyframes menuSlideUp {
  0% { transform: translateY(30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* 背景照片装饰 */
.background-photo {
  position: absolute;
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  opacity: 0.8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1;
  pointer-events: auto;  /* 允许照片被点击 */
  cursor: pointer;       /* 显示可点击指针 */
}

.background-photo:hover {
  opacity: 1;
  transform: scale(1.05);
}

/* 各照片的位置 - 您可以修改这些数值来调整位置 */
.photo-me {
  top: 15%;
  left: 60%;
  transform: rotate(-5deg);
}

.photo-feier1 {
  top: 28%;
  left: 58%;
}

.photo-feier2 {
  top: 37%;
  left: 80%;
}

.photo-chouchou {
  top: 43%;
  left: 80%;
  transform: rotate(10deg);
}

.photo-wukong {
  top: 21%;
  left: 58%;
  transform: rotate(5deg);
}

.photo-together {
  top: 18%;
  left: 80%;
 transform: rotate(5deg);
}



/* 交互热区层 */
.interactive-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.interactive-area {
  position: absolute;
  background: rgba(138, 43, 226, 0.05);  /* 轻微可见背景 */
  border: 1px solid rgba(255, 255, 255, 0.2);  /* 轻微边框 */
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.interactive-area:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 20px rgba(138, 43, 226, 0.6);
  transform: scale(1.02);
}

/* 交互图标 */
.interaction-icon {
  font-size: 20px;
  opacity: 0.7;
  transition: all 0.3s ease;
  animation: iconPulse 2s ease-in-out infinite;
}

.interactive-area:hover .interaction-icon {
  opacity: 1;
  transform: scale(1.2);
}

.card-area {
  top: 25%;
  left: 35%;
  width: 20%;
  height: 15%;
}

.gift-area {
  bottom: 20%;
  left: 15%;
  width: 8%;
  height: 12%;
}





/* 特效元素 */
.screen-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  animation: screenPulse 2s ease-in-out infinite;
  pointer-events: none;
}

.gift-sparkle {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  background: radial-gradient(circle, rgba(255,192,239,0.4) 0%, transparent 60%);
  animation: sparkle 1.5s ease-in-out infinite;
  pointer-events: none;
}

/* 提示气泡 */
.hint-bubble {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  pointer-events: none;
  z-index: 100;
  animation: fadeIn 0.3s ease;
}

/* 动画定义 */
@keyframes catSleep {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes stretchEffect {
  0% { transform: rotate(--5deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.05); }
  50% { transform: rotate(-5deg) scale(1.08); }
  75% { transform: rotate(-5deg) scale(1.03); }
  100% { transform: rotate(-5deg) scale(1); }
}

@keyframes spiritFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes screenPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes iconPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes cardGlow {
  0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(255, 192, 239, 0.3)); }
  50% { filter: brightness(1.1) drop-shadow(0 0 15px rgba(255, 192, 239, 0.6)); }
}

@keyframes giftboxSparkle {
  0%, 100% { filter: brightness(1) drop-shadow(0 0 8px rgba(255, 192, 239, 0.4)); transform: scale(1); }
  50% { filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 192, 239, 0.8)); transform: scale(1.05); }
}

@keyframes wiggle {
  0% { transform: rotate(0deg); }
  15% { transform: rotate(-2deg); }
  30% { transform: rotate(2deg); }
  45% { transform: rotate(-1deg); }
  60% { transform: rotate(1deg); }
  75% { transform: rotate(-0.5deg); }
  90% { transform: rotate(0.5deg); }
  100% { transform: rotate(0deg); }
}

@keyframes cardWiggle {
  0% { transform: rotate(0deg); filter: brightness(1) drop-shadow(0 0 5px rgba(255, 192, 239, 0.3)); }
  15% { transform: rotate(-2deg); filter: brightness(1.1) drop-shadow(0 0 10px rgba(255, 192, 239, 0.5)); }
  30% { transform: rotate(2deg); filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 192, 239, 0.7)); }
  45% { transform: rotate(-1deg); filter: brightness(1.1) drop-shadow(0 0 12px rgba(255, 192, 239, 0.6)); }
  60% { transform: rotate(1deg); filter: brightness(1.15) drop-shadow(0 0 8px rgba(255, 192, 239, 0.4)); }
  75% { transform: rotate(-0.5deg); filter: brightness(1.05) drop-shadow(0 0 6px rgba(255, 192, 239, 0.3)); }
  90% { transform: rotate(0.5deg); filter: brightness(1.02) drop-shadow(0 0 4px rgba(255, 192, 239, 0.2)); }
  100% { transform: rotate(0deg); filter: brightness(1) drop-shadow(0 0 5px rgba(255, 192, 239, 0.3)); }
}

@keyframes giftWiggle {
  0% { transform: scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 8px rgba(255, 192, 239, 0.4)); }
  15% { transform: scale(1.02) rotate(-3deg); filter: brightness(1.1) drop-shadow(0 0 12px rgba(255, 192, 239, 0.6)); }
  30% { transform: scale(1.04) rotate(3deg); filter: brightness(1.2) drop-shadow(0 0 18px rgba(255, 192, 239, 0.8)); }
  45% { transform: scale(1.03) rotate(-2deg); filter: brightness(1.15) drop-shadow(0 0 15px rgba(255, 192, 239, 0.7)); }
  60% { transform: scale(1.02) rotate(2deg); filter: brightness(1.1) drop-shadow(0 0 10px rgba(255, 192, 239, 0.5)); }
  75% { transform: scale(1.01) rotate(-1deg); filter: brightness(1.05) drop-shadow(0 0 8px rgba(255, 192, 239, 0.4)); }
  90% { transform: scale(1) rotate(1deg); filter: brightness(1.02) drop-shadow(0 0 6px rgba(255, 192, 239, 0.3)); }
  100% { transform: scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 8px rgba(255, 192, 239, 0.4)); }
}

@keyframes wukongGlow {
  0%, 100% {
    transform: rotate(15deg);
    filter: brightness(0.8) drop-shadow(0 0 8px rgba(0, 255, 255, 0.3));
  }
  25% {
    transform: rotate(15deg) scale(1.02);
    filter: brightness(1.0) drop-shadow(0 0 15px rgba(0, 255, 255, 0.5));
  }
  50% {
    transform: rotate(15deg) scale(1.05);
    filter: brightness(1.2) drop-shadow(0 0 25px rgba(0, 255, 255, 0.8));
  }
  75% {
    transform: rotate(15deg) scale(1.02);
    filter: brightness(1.0) drop-shadow(0 0 18px rgba(0, 255, 255, 0.6));
  }
}

/* 模态框样式 */
.card-modal, .collection-modal, .memory-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;  /* 提高到最高层级 */
  animation: modalFadeIn 0.3s ease;
}

.card-content, .collection-content, .memory-content {
  background: linear-gradient(135deg, #ffc2ef 0%, #8a2be2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 90%;
  max-height: 90%;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s ease;
  z-index: 10000;  /* 确保弹窗内容在最顶层 */
  overflow-y: auto;  /* 添加垂直滚动 */
  display: flex;
  flex-direction: column;
}

.card-scroll {
  max-height: 70vh;
  overflow-y: auto;
  text-align: center;
}

.card-header h2 {
  color: #2a0845;
  font-size: 28px;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.3);
}

.friend-photo {
  position: relative;
  margin: 20px 0;
}

.photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #fff;
  filter: brightness(1.1) saturate(1.15);
}

.photo-decoration {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  animation: decorationFloat 2s ease-in-out infinite;
}

.blessing-text {
  color: #2a0845;
  font-size: 18px;
  line-height: 1.8;
  margin: 20px 0;
}

.blessing-text p {
  margin: 10px 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.signature {
  font-size: 20px;
  font-weight: bold;
  margin-top: 30px;
  color: #8a2be2;
}

.collection-description {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-bottom: 20px;
  font-size: 14px;
}

.empty-collection {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 14px;
  color: #8a2be2;
  font-style: italic;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin: 20px 0;
  flex: 1;  /* 占用剩余空间 */
  overflow-y: auto;  /* 卡片区域可滚动 */
  max-height: 60vh;  /* 限制最大高度 */
  padding-right: 10px;  /* 为滚动条留出空间 */
}

/* 自定义滚动条样式 */
.cards-grid::-webkit-scrollbar {
  width: 8px;
}

.cards-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.cards-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.cards-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.card-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  transition: transform 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 200px;  /* 增加最小高度 */
  justify-content: space-between;  /* 内容均匀分布 */
}

.card-item:hover {
  transform: scale(1.05);
}

.card-item.rare {
  background: linear-gradient(135deg, #ffd700 0%, #ffeb3b 100%);
}

.card-item.epic {
  background: linear-gradient(135deg, #9c27b0 0%, #e91e63 100%);
  color: white;
}

.card-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.card-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.card-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
  line-height: 1.4;
  flex: 1;  /* 占用可用空间 */
  display: flex;
  align-items: center;  /* 垂直居中 */
}

.card-quantity {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(138, 43, 226, 0.8);
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: bold;
}

.card-source {
  font-size: 11px;
  opacity: 0.7;
  margin-top: auto;
  line-height: 1.3;
  word-wrap: break-word;  /* 长文本自动换行 */
}

.memory-header h3 {
  color: #2a0845;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.memory-body {
  display: flex;
  align-items: center;
  gap: 20px;
}

.wukong-photo {
  position: relative;
}

.memory-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  filter: brightness(1.1) saturate(1.15);
}

.spirit-effect {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%);
  animation: spiritGlow 2s ease-in-out infinite;
}

.memory-text {
  flex: 1;
  color: #2a0845;
  font-size: 16px;
  line-height: 1.6;
}

.memory-text p {
  margin: 8px 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.paw-print {
  font-size: 20px;
  text-align: center;
  margin-top: 15px;
}

/* 返回按钮样式 */
.prev-navigation-button {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 10;
}

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
}

.prev-chapter-btn:hover {
  background: linear-gradient(135deg, #9932CC 0%, #BA55D3 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(138, 43, 226, 0.6);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
}

/* 模态框动画 */
@keyframes modalFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modalSlideIn {
  from { transform: scale(0.8) translateY(-50px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes decorationFloat {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(10deg) scale(1.1); }
}

@keyframes spiritGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cat-container {
    width: 150px;
    height: 150px;
  }

  .computer-top {
    width: 128px;
    height: 60px;
  }

  .birthday-card {
    width: 80px;
    height: 60px;
  }

  .giftbox {
    width: 70px;
    height: 70px;
  }

  .wukong-spirit {
    width: 50px;
    height: 50px;
  }

  .background-photo {
    width: 60px;
    height: 45px;
  }

  .interactive-area {
    border-width: 3px;
  }

  .cards-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));  /* 增加最小宽度 */
    gap: 10px;
    max-height: 200vh;  /* 移动端减少高度 */
  }

  .card-item {
    min-height: 200px;  /* 移动端稍微减少高度 */
  }

  .card-content, .collection-content, .memory-content {
    padding: 20px;
    max-width: 95%;
  }

  .hint-bubble {
    font-size: 12px;
    padding: 6px 10px;
  }

  .card-content, .collection-content, .memory-content {
    padding: 20px;
    margin: 10px;
  }

  .memory-body {
    flex-direction: column;
    text-align: center;
  }

  .photo, .memory-photo {
    width: 120px;
    height: 120px;
  }

  .prev-navigation-button {
    bottom: 20px;
    left: 20px;
  }

  .blessing-text {
    font-size: 16px;
  }

  .prev-navigation-button {
    bottom: 20px;
    left: 20px;
  }
}
</style>

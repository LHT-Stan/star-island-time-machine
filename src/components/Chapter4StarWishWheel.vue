<template>
  <div class="chapter4-container">
    <!-- 章节标题 -->
    <div class="chapter-title">
      <h2>🌙 白夜的星愿转盘</h2>
      <p class="chapter-subtitle">在星光下许下心愿，获得珍贵的零食兑换卡</p>
    </div>

    <!-- 白夜角色区域 -->
    <div class="baiye-character">
      <div class="character-container">
        <div class="baiye-sprite">🌙</div>
        <div class="character-dialogue" v-if="showDialogue">
          <p>{{ currentDialogue }}</p>
        </div>
      </div>
    </div>

    <!-- 抽奖系统容器 -->
    <div class="lottery-system-container">
      <!-- 左侧魔法杖 -->
      <div class="left-magic-wand" :class="{ 'waving': isSpinning }">
        <div class="wand-stick">🪄</div>
        <div class="wand-sparkles">✨</div>
      </div>

      <!-- 中央指针系统 -->
      <div class="central-pointer-container">
        <!-- 奖励选项圆环 -->
        <div class="reward-circle">
          <div
            v-for="(sector, index) in wheelSectors"
            :key="index"
            class="reward-option"
            :class="[sector.rarity, { 'highlighted': highlightedSector === index }]"
            :style="getRewardOptionStyle(index)"
          >
            <div class="option-content">
              <div class="option-icon">{{ sector.icon }}</div>
              <div class="option-label">{{ sector.label }}</div>
            </div>
          </div>
        </div>


      </div>

      <!-- 右侧白夜精灵 -->
      <div class="right-spirit-container">
        <div class="spirit-circle" :class="{ 'casting': isSpinning }">
          <img
            :src="spiritImageUrl"
            alt="白夜精灵"
            class="spirit-image"
            :class="{ 'casting': isSpinning }"
          />

          <!-- 精灵光环 -->
          <div class="spirit-aura" :class="{ 'active': isSpinning }">
            <div class="aura-ring ring-1"></div>
            <div class="aura-ring ring-2"></div>
          </div>
        </div>
      </div>

      <!-- 底部奖励展示 -->
      <div class="bottom-reward-display" v-if="currentCard && currentCard.name && !isSpinning">
        <div class="reward-card" :class="currentCard.rarity">
          <div class="card-icon">{{ currentCard.icon }}</div>
          <div class="card-name">{{ currentCard.name }}</div>
        </div>
      </div>
    </div>

    <!-- 数字3显示区域 -->
    <div v-if="showNumber3 && !number3Collected"
         class="number-display number-3"
         @click="handleNumber3Click">
      <span class="number-reflection">3</span>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-area">
      <div class="button-group">
        <button
          @click="spinWheel"
          class="spin-button"
          :disabled="isSpinning || cooldownTime > 0"
        >
          <span v-if="cooldownTime > 0">冷却中 ({{ cooldownTime }}s)</span>
          <span v-else-if="isSpinning">转盘旋转中...</span>
          <span v-else>🌟 开始抽奖</span>
        </button>

        <button
          @click="showCollection"
          class="collection-button"
          :disabled="isSpinning"
        >
          🗂️ 查看收藏 ({{ collectedCards.length }})
        </button>
      </div>
    </div>

    <!-- 结果展示弹窗 - 使用Teleport确保正确层级 -->
    <Teleport to="body">
      <div v-if="showResult" class="result-modal" @click="closeResult">
        <div class="result-content" @click.stop>
        <div class="result-header">
          <h3>🎁 恭喜获得</h3>
          <button @click="closeResult" class="close-btn">×</button>
        </div>
        <div class="card-display">
          <div class="card" :class="currentCard.rarity">
            <div class="card-icon">{{ currentCard.icon }}</div>
            <div class="card-name">{{ currentCard.name }}</div>
            <div class="card-description">{{ currentCard.description }}</div>
            <div class="card-rarity">{{ getRarityText(currentCard.rarity) }}</div>
          </div>
        </div>
        <div class="result-actions">
          <button @click="collectCard" class="collect-btn">收藏卡片</button>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- 收藏展示弹窗 -->
    <Teleport to="body">
      <div v-if="showCollectionModal" class="collection-modal" @click="closeCollection">
      <div class="collection-content" @click.stop>
        <div class="collection-header">
          <h3>🗂️ 零食兑换卡收藏</h3>
          <button @click="closeCollection" class="close-btn">×</button>
        </div>
        <div class="collection-stats">
          <div class="stat-item">
            <span class="stat-label">总收藏:</span>
            <span class="stat-value">{{ gameStats.cardsCollected }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">种类:</span>
            <span class="stat-value">{{ collectedCards.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总价值:</span>
            <span class="stat-value">{{ gameStats.totalValue }}</span>
          </div>
        </div>
        <div class="collection-grid">
          <div
            v-for="card in collectedCards"
            :key="card.uniqueId"
            class="collection-card"
            :class="card.rarity"
          >
            <div class="card-icon">{{ card.icon }}</div>
            <div class="card-name">{{ card.name }}</div>
            <div class="card-quantity">x{{ card.quantity || 1 }}</div>
            <div class="card-rarity">{{ getRarityText(card.rarity) }}</div>
          </div>
        </div>
        <div v-if="collectedCards.length === 0" class="empty-collection">
          <p>还没有收藏任何卡片</p>
          <p>快去转动星愿转盘吧！</p>
        </div>
      </div>
    </div>
    </Teleport>

    <!-- 导航按钮 -->
    <div v-if="showNavigationButton" class="navigation-button">
      <button @click="goToNextChapter" class="next-chapter-btn">
        前往第五章 →
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, Teleport } from 'vue'
import spiritImageUrl from '../assets/images/baiye.jpg'
import numberCollector from '../utils/numberCollector.js'

export default {
  name: 'Chapter4StarWishWheel',
  components: {
    Teleport
  },
  setup() {
    // 基础状态
    const isSpinning = ref(false)
    const showDialogue = ref(true)
    const showResult = ref(false)
    const showCollectionModal = ref(false)
    const showNavigationButton = ref(false)
    const cooldownTime = ref(0)
    const wheelRef = ref(null)
    const highlightedSector = ref(-1) // 当前高亮的扇形
    const currentSpeed = ref(0) // 当前转动速度 (0-100)

    // 当前对话和卡片
    const currentDialogue = ref('欢迎来到星愿转盘，让我为你准备一份特别的礼物吧~')
    const currentCard = ref(null)

    // 转盘扇形区域数据
    const wheelSectors = reactive([
      { icon: '🥛', label: '乳酸菌', rarity: 'common' },
      { icon: '🍠', label: '紫薯干', rarity: 'common' },
      { icon: '🥤', label: '美年达', rarity: 'common' },
      { icon: '🧊', label: '北冰洋汽水', rarity: 'common' },
      { icon: '🦄', label: '独角兽娃娃', rarity: 'rare' },
      { icon: '🎁', label: '自选零食大礼包', rarity: 'rare' },
      { icon: '🌟', label: '许愿星', rarity: 'epic' },
      { icon: '💎', label: '永恒约定', rarity: 'special' }
    ])

    // 卡片数据模板
    const cardTemplates = {
      common: [
        {
          id: 'yogurt_card',
          icon: '🥛',
          name: '乳酸菌饮品券',
          description: '健康美味的乳酸菌，呵护肠胃健康',
          rarity: 'common',
          value: 1,
          category: 'drink'
        },
        {
          id: 'purple_potato_card',
          icon: '🍠',
          name: '紫薯干礼盒',
          description: '香甜软糯的紫薯干，天然健康零食',
          rarity: 'common',
          value: 1,
          category: 'snack'
        },
        {
          id: 'mirinda_card',
          icon: '🥤',
          name: '美年达汽水券',
          description: '清爽甘甜的橙味汽水，夏日必备',
          rarity: 'common',
          value: 1,
          category: 'drink'
        },
        {
          id: 'arctic_ocean_card',
          icon: '🧊',
          name: '北冰洋汽水券',
          description: '经典怀旧的桔子汽水，满满回忆',
          rarity: 'common',
          value: 1,
          category: 'drink'
        }
      ],
      rare: [
        {
          id: 'unicorn_doll_card',
          icon: '🦄',
          name: '独角兽娃娃',
          description: '梦幻可爱的独角兽毛绒玩具，陪伴每个美好夜晚',
          rarity: 'rare',
          value: 3,
          category: 'toy'
        },
        {
          id: 'snack_gift_card',
          icon: '🎁',
          name: '自选零食大礼包',
          description: '丰富多样的零食组合，满足所有味蕾的渴望',
          rarity: 'rare',
          value: 3,
          category: 'gift'
        }
      ],
      epic: [
        {
          id: 'wish_star_card',
          icon: '🌟',
          name: '许愿星',
          description: '承载着美好愿望的神秘星辰，能够实现心中的小小愿望',
          rarity: 'epic',
          value: 5,
          category: 'magic'
        }
      ],
      special: [
        {
          id: 'eternal_promise_card',
          icon: '💎',
          name: '永恒约定',
          description: '象征着永不褪色的友谊，见证最珍贵的情感纽带',
          rarity: 'special',
          value: 10,
          category: 'friendship'
        }
      ]
    }

    // 游戏统计数据
    const gameStats = reactive({
      totalSpins: 0,
      cardsCollected: 0,
      commonCards: 0,
      rareCards: 0,
      epicCards: 0,
      specialCards: 0,
      totalValue: 0,
      firstSpinTime: null,
      lastSpinTime: null
    })

    // 收藏的卡片列表
    const collectedCards = ref([])

    // 抽奖次数限制
    const baseSpins = 3              // 基础3次
    const wukongLetterBonus = 2      // 悟空信件解锁+2次
    const developerLetterBonus = 3   // 开发者信件解锁+3次
    const maxTotalSpins = 8          // 总共最多8次 (3+2+3)

    const isWukongLetterUnlocked = ref(false)     // 是否解锁悟空信件
    const isDeveloperLetterUnlocked = ref(false)  // 是否解锁开发者信件

    // 已抽到的物品记录 (防止重复)
    const drawnItems = ref(new Set())

    // 数字收集系统 - 第四章数字3
    const showNumber3 = ref(false)
    const number3Collected = ref(false)

    // 抽奖概率配置
    const probabilityConfig = {
      common: 0.50,    // 50%
      rare: 0.25,      // 25%
      epic: 0.125,     // 12.5%
      special: 0.125   // 12.5%
    }

    // 获取奖励选项样式
    const getRewardOptionStyle = (index) => {
      const totalOptions = wheelSectors.length
      const angle = (360 / totalOptions) * index
      const radius = 120
      
      const x = Math.cos((angle - 90) * Math.PI / 180) * radius
      const y = Math.sin((angle - 90) * Math.PI / 180) * radius
      
      // 🎯 添加整体偏移量
      const offsetX = -30  // 负数向左移动，正数向右移动
      const offsetY = -30  // 负数向上移动，正数向下移动
      
      return {
        transform: `translate(${x + offsetX}px, ${y + offsetY}px)`,
        '--option-angle': `${angle}deg`
      }
    }

    // 获取稀有度文本
    const getRarityText = (rarity) => {
      const rarityMap = {
        common: '普通',
        rare: '稀有',
        epic: '史诗',
        special: '特殊'
      }
      return rarityMap[rarity] || '未知'
    }

    // 获取粒子样式
    const getParticleStyle = (index) => {
      const angle = (360 / 8) * index
      const radius = 120
      const x = Math.cos(angle * Math.PI / 180) * radius
      const y = Math.sin(angle * Math.PI / 180) * radius

      return {
        '--particle-x': `${x}px`,
        '--particle-y': `${y}px`,
        '--delay': `${index * 0.1}s`
      }
    }

    // 计算当前允许的最大抽奖次数
    const getCurrentMaxSpins = () => {
      let maxAllowed = baseSpins // 基础3次
      if (isWukongLetterUnlocked.value) {
        maxAllowed += wukongLetterBonus // +2次
      }
      if (isDeveloperLetterUnlocked.value) {
        maxAllowed += developerLetterBonus // +3次
      }
      return maxAllowed
    }

    // 检查抽奖次数限制
    const checkSpinLimit = () => {
      const maxAllowed = getCurrentMaxSpins()
      // 检查是否还有可抽的物品
      const totalItems = cardTemplates.common.length + cardTemplates.rare.length + cardTemplates.epic.length + cardTemplates.special.length
      const hasAvailableItems = drawnItems.value.size < totalItems

      return gameStats.totalSpins < maxAllowed && hasAvailableItems
    }

    // 解锁悟空信件 (从其他章节调用)
    const unlockWukongLetter = () => {
      isWukongLetterUnlocked.value = true
      const newMax = getCurrentMaxSpins()
      console.log(`🔓 悟空信件已解锁，抽奖次数增加到${newMax}次`)
      saveGameData() // 保存解锁状态
    }

    // 解锁开发者信件 (从其他章节调用)
    const unlockDeveloperLetter = () => {
      isDeveloperLetterUnlocked.value = true
      const newMax = getCurrentMaxSpins()
      console.log(`🔓 开发者信件已解锁，抽奖次数增加到${newMax}次`)
      saveGameData() // 保存解锁状态
    }

    // 获取当前抽奖状态信息
    const getSpinStatus = () => {
      const maxAllowed = getCurrentMaxSpins()
      const totalItems = cardTemplates.common.length + cardTemplates.rare.length + cardTemplates.epic.length + cardTemplates.special.length
      const remainingItems = totalItems - drawnItems.value.size

      return {
        currentSpins: gameStats.totalSpins,
        maxSpins: maxAllowed,
        canSpin: checkSpinLimit(),
        isWukongLetterUnlocked: isWukongLetterUnlocked.value,
        isDeveloperLetterUnlocked: isDeveloperLetterUnlocked.value,
        drawnItems: drawnItems.value.size,
        totalItems: totalItems,
        remainingItems: remainingItems
      }
    }

    // 白夜精灵魔法抽奖逻辑
    const spinWheel = async () => {
      if (isSpinning.value || cooldownTime.value > 0) return

      // 🎯 检查抽奖次数限制
      if (!checkSpinLimit()) {
        const maxAllowed = getCurrentMaxSpins()
        let message = `魔法能量已经用完了~ (${gameStats.totalSpins}/${maxAllowed})`

        if (!isWukongLetterUnlocked.value) {
          message = `魔法能量不足，需要解锁悟空的秘密信件才能继续~ (${gameStats.totalSpins}/${maxAllowed})`
        } else if (!isDeveloperLetterUnlocked.value) {
          message = `魔法能量不足，试试游戏中那些隐藏起来的线索，解锁更多魔法能量吧~ (${gameStats.totalSpins}/${maxAllowed})`
        }

        currentDialogue.value = message
        showDialogue.value = true
        return
      }

      console.log('� 白夜精灵开始施法')
      isSpinning.value = true
      showDialogue.value = false

      // 更新统计数据
      gameStats.totalSpins++
      if (!gameStats.firstSpinTime) {
        gameStats.firstSpinTime = new Date().toISOString()
      }
      gameStats.lastSpinTime = new Date().toISOString()

      // 检查数字3解锁条件：完成5次抽奖
      if (gameStats.totalSpins >= 5 && !number3Collected.value) {
        showNumber3.value = true
        console.log('✨ 完成5次抽奖！数字3解锁！')
        console.log('当前抽奖次数:', gameStats.totalSpins)
      }

      try {
        // 1. 计算抽奖结果
        const result = calculateSpinResult()
        currentCard.value = result.card

        console.log('✨ 魔法结果:', result.debug)

        // 2. 执行抽奖动画
        await performLotteryAnimation(result.finalAngle)

        // 3. 显示结果
        await showSpinResult(result.card.rarity)

      } catch (error) {
        console.error('� 魔法施法出错:', error)
        isSpinning.value = false
        showDialogue.value = true

        if (error.message === '所有物品都已抽完') {
          currentDialogue.value = '所有的魔法礼物都已经被你收集完了！真是太厉害了~'
        } else {
          currentDialogue.value = '魔法出现了问题，请稍后再试~'
        }
      }
    }

    // 计算抽奖结果 - 确保不重复
    const calculateSpinResult = () => {
      // 获取所有可用的扇形（未抽到的）
      const availableSectors = wheelSectors.filter((sector, index) => {
        // 检查这个扇形对应的卡片是否已经抽到
        const templates = cardTemplates[sector.rarity]
        const matchingCard = templates.find(card => card.icon === sector.icon)
        return matchingCard && !drawnItems.value.has(matchingCard.id)
      })

      // 如果没有可用扇形，抛出错误
      if (availableSectors.length === 0) {
        throw new Error('所有物品都已抽完')
      }

      // 从可用扇形中随机选择
      const randomSector = availableSectors[Math.floor(Math.random() * availableSectors.length)]
      const resultSectorIndex = wheelSectors.findIndex(sector => sector === randomSector)

      // 计算角度
      const sectorAngle = 360 / wheelSectors.length
      const targetAngle = resultSectorIndex * sectorAngle + (sectorAngle / 2)
      const spinRotations = 5 // 转5圈增加期待感
      const finalAngle = spinRotations * 360 + targetAngle

      // 生成悬念角度序列
      const suspenseAngles = generateSuspenseAngles(finalAngle, randomSector.rarity)

      // 生成对应的卡片
      const templates = cardTemplates[randomSector.rarity]
      const matchingCard = templates.find(card => card.icon === randomSector.icon)

      // 记录已抽到的物品
      drawnItems.value.add(matchingCard.id)

      const card = {
        ...matchingCard,
        obtainedAt: new Date().toISOString(),
        uniqueId: `${matchingCard.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sectorIndex: resultSectorIndex,
        targetAngle: targetAngle
      }

      return {
        card,
        finalAngle,
        suspenseAngles,
        debug: {
          availableSectors: availableSectors.length,
          selectedSector: randomSector.name,
          resultSectorIndex,
          targetAngle,
          finalAngle,
          rarity: randomSector.rarity
        }
      }
    }

    // 生成悬念角度序列 - 增强版
    const generateSuspenseAngles = (finalAngle, rarity) => {
      const sectorAngle = 360 / wheelSectors.length
      const suspenseAngles = []

      console.log('🎭 生成悬念序列:', { finalAngle, rarity, sectorAngle })

      // 根据稀有度设计不同的悬念策略
      const suspenseConfig = {
        common: {
          nearMisses: 1,
          maxOvershoot: sectorAngle * 0.3,
          pauseDuration: 100
        },
        rare: {
          nearMisses: 2,
          maxOvershoot: sectorAngle * 0.5,
          pauseDuration: 150
        },
        epic: {
          nearMisses: 3,
          maxOvershoot: sectorAngle * 0.7,
          pauseDuration: 200
        },
        special: {
          nearMisses: 4,
          maxOvershoot: sectorAngle * 0.9,
          pauseDuration: 250
        }
      }

      const config = suspenseConfig[rarity] || suspenseConfig.common

      // 创建"差一点"的刺激序列
      for (let i = 0; i < config.nearMisses; i++) {
        if (i === 0) {
          // 第一次：接近目标但停在前一个奖励
          const prevSectorAngle = finalAngle - sectorAngle + (sectorAngle * 0.8)
          suspenseAngles.push(prevSectorAngle)
        } else if (i === 1) {
          // 第二次：更接近目标
          const nearTargetAngle = finalAngle - (sectorAngle * 0.3)
          suspenseAngles.push(nearTargetAngle)
        } else if (i === 2) {
          // 第三次：几乎到达目标
          const almostTargetAngle = finalAngle - (sectorAngle * 0.1)
          suspenseAngles.push(almostTargetAngle)
        } else {
          // 更多次：在目标附近摆动
          const oscillation = (i % 2 === 0 ? -1 : 1) * (sectorAngle * 0.05)
          suspenseAngles.push(finalAngle + oscillation)
        }
      }

      // 特殊稀有度：添加"越过目标"的遗憾感
      if (rarity === 'epic' || rarity === 'special') {
        const overshootAngle = finalAngle + (config.maxOvershoot * 0.6)
        suspenseAngles.push(overshootAngle)

        // 然后慢慢回到目标
        const returnAngle = finalAngle + (config.maxOvershoot * 0.2)
        suspenseAngles.push(returnAngle)
      }

      // 最终目标
      suspenseAngles.push(finalAngle)

      console.log('🎭 悬念序列生成完成:', suspenseAngles)
      return suspenseAngles
    }

    // 白夜精灵施法动画
    const performMagicCasting = async () => {
      console.log('🌙 精灵开始挥舞魔法杖')

      // 播放魔法音效
      playMagicSound()

      // 施法动画持续3秒
      await delay(3000)

      console.log('✨ 魔法施法完成')
    }

    // 执行抽奖动画 - 顺时针转圈版本
    const performLotteryAnimation = async (finalAngle) => {
      console.log('🎯 开始抽奖动画')

      // 播放魔法音效
      playMagicSound()

      // 计算最终选中的选项
      const finalSectorIndex = Math.floor((finalAngle % 360) / (360 / wheelSectors.length))

      // 转圈参数
      let currentIndex = 0
      let rotateSpeed = 80 // 初始速度(ms)
      const minSpeed = 400   // 最慢速度(ms)
      const speedIncrement = 15 // 每次减速增量
      const totalRounds = 3  // 总共转3圈
      let completedRounds = 0
      let stepCount = 0

      return new Promise((resolve) => {
        const rotateStep = () => {
          // 高亮当前选项
          highlightedSector.value = currentIndex

          // 更新速度指示器
          const progress = Math.min(100, (stepCount / (totalRounds * wheelSectors.length)) * 100)
          currentSpeed.value = progress

          // 移动到下一个选项
          currentIndex = (currentIndex + 1) % wheelSectors.length

          // 如果完成一圈
          if (currentIndex === 0) {
            completedRounds++
          }

          stepCount++

          // 逐渐减速
          if (stepCount > 6) { // 前6步保持快速
            rotateSpeed = Math.min(rotateSpeed + speedIncrement, minSpeed)
          }

          // 判断是否应该停止
          const shouldStop = completedRounds >= totalRounds && currentIndex === finalSectorIndex

          if (shouldStop) {
            // 最终确定选中的选项
            highlightedSector.value = finalSectorIndex
            currentSpeed.value = 0
            console.log('🎯 抽奖动画完成')
            resolve()
          } else {
            // 继续下一步
            setTimeout(rotateStep, rotateSpeed)
          }
        }

        // 开始转圈
        rotateStep()
      })
    }


    // 更新高亮选项
    const updateHighlightedOption = (angle) => {
      const totalOptions = wheelSectors.length
      const sectorAngle = 360 / totalOptions
      const normalizedAngle = ((angle % 360) + 360) % 360
      const optionIndex = Math.floor(normalizedAngle / sectorAngle)

      highlightedSector.value = optionIndex

      console.log('🎯 高亮选项更新:', {
        angle: normalizedAngle.toFixed(1),
        optionIndex,
        optionName: wheelSectors[optionIndex]?.label
      })
    }

    // 播放魔法音效
    const playMagicSound = () => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        // 魔法音效 - 神秘的上升音调
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 1.5)
        oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 3)

        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 1.5)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 3)
      } catch (error) {
        console.log('🎵 魔法音效播放失败:', error)
      }
    }

    // 执行三阶段旋转动画 - 指针旋转版本
    const executeThreePhaseAnimation = async (finalAngle, suspenseAngles) => {
      const pointerElement = document.querySelector('.wheel-pointer')
      if (!pointerElement) return

      // 重置指针位置
      pointerElement.style.transition = 'none'
      pointerElement.style.transform = 'translate(-50%, -50%) rotate(0deg)'
      pointerElement.offsetHeight // 强制重绘

      console.log('🎯 开始三阶段动画（指针旋转）:', { finalAngle, suspenseAngles })

      // 阶段1: 快速启动 (1秒)
      await animatePhase1(pointerElement)

      // 阶段2: 匀速旋转 (1.5秒)
      await animatePhase2(pointerElement, finalAngle)

      // 阶段3: 减速悬念 (2秒)
      await animatePhase3(pointerElement, suspenseAngles)
    }

    // 阶段1: 快速启动 - 指针版本
    const animatePhase1 = (pointerElement) => {
      return new Promise(resolve => {
        console.log('🚀 阶段1: 快速启动（指针旋转）')
        playPhaseSound('start')

        pointerElement.style.transition = 'transform 1s ease-out'
        pointerElement.style.transform = 'translate(-50%, -50%) rotate(720deg)' // 快速转2圈

        setTimeout(resolve, 1000)
      })
    }

    // 阶段2: 匀速旋转 - 指针版本
    const animatePhase2 = (pointerElement, finalAngle) => {
      return new Promise(resolve => {
        console.log('🔄 阶段2: 匀速旋转（指针旋转）')
        playPhaseSound('spin')

        const midAngle = finalAngle - 360 // 在最终角度前1圈停止
        pointerElement.style.transition = 'transform 1.5s linear'
        pointerElement.style.transform = `translate(-50%, -50%) rotate(${midAngle}deg)`

        setTimeout(resolve, 1500)
      })
    }

    // 阶段3: 减速悬念 - 指针版本
    const animatePhase3 = async (pointerElement, suspenseAngles) => {
      console.log('🎯 阶段3: 减速悬念开始（指针旋转）', suspenseAngles)
      playPhaseSound('suspense')

      for (let i = 0; i < suspenseAngles.length; i++) {
        const angle = suspenseAngles[i]
        const isLast = i === suspenseAngles.length - 1
        const isSecondLast = i === suspenseAngles.length - 2

        // 动态计算持续时间 - 越接近目标越慢
        let duration
        if (isLast) {
          duration = 800 // 最后停止要慢但不要太慢
        } else if (isSecondLast) {
          duration = 600 // 倒数第二个也要慢
        } else {
          duration = 150 + (i * 100) // 逐渐变慢，但更流畅
        }

        // 动态计算缓动函数
        const easing = isLast
          ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' // 最后平滑停止
          : isSecondLast
          ? 'cubic-bezier(0.5, 0, 0.5, 1)' // 倒数第二个减速
          : 'ease-out' // 其他正常减速

        console.log(`🎭 悬念步骤 ${i + 1}/${suspenseAngles.length}:`, {
          angle: angle.toFixed(1),
          duration,
          easing,
          isLast
        })

        await animatePointerToAngle(pointerElement, angle, duration, easing)

        // 停顿时间也要动态调整，但减少停顿时间
        if (!isLast) {
          const pauseDuration = isSecondLast ? 200 : 50 + (i * 30)
          console.log(`⏸️ 悬念停顿: ${pauseDuration}ms`)
          await delay(pauseDuration)

          // 在关键位置播放"心跳"音效
          if (i >= suspenseAngles.length - 3) {
            playHeartbeatSound()
          }
        }
      }

      console.log('🎯 阶段3: 减速悬念完成')
    }

    // 指针角度动画 - 带高亮效果
    const animatePointerToAngle = (pointerElement, angle, duration, easing) => {
      return new Promise(resolve => {
        pointerElement.style.transition = `transform ${duration}ms ${easing}`
        pointerElement.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`

        // 更新高亮扇形
        updateHighlightedSector(angle)

        setTimeout(resolve, duration)
      })
    }

    // 根据指针角度更新高亮扇形
    const updateHighlightedSector = (angle) => {
      const sectorAngle = 360 / wheelSectors.length
      // 计算指针指向的扇形索引
      const normalizedAngle = ((angle % 360) + 360) % 360
      const sectorIndex = Math.floor(normalizedAngle / sectorAngle)

      highlightedSector.value = sectorIndex

      console.log('🎯 高亮扇形更新:', {
        angle: normalizedAngle.toFixed(1),
        sectorIndex,
        sectorName: wheelSectors[sectorIndex]?.label
      })
    }

    // 播放心跳音效
    const playHeartbeatSound = () => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        // 心跳般的低频音效
        oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.1)
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.2)

        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.2)
      } catch (error) {
        console.log('🎵 心跳音效播放失败:', error)
      }
    }

    // 动画到指定角度
    const animateToAngle = (angle, duration, isLast) => {
      return new Promise(resolve => {
        const easing = isLast ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'ease-out'
        wheelRef.value.style.transition = `transform ${duration}ms ${easing}`
        wheelRef.value.style.transform = `rotate(${angle}deg)`

        setTimeout(resolve, duration)
      })
    }

    // 延迟函数
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    // 显示抽奖结果 - 简化版本
    const showSpinResult = async (rarity) => {
      console.log('🎁 显示抽奖结果开始')

      // 短暂停顿让转盘完全停止
      await delay(500)

      // 播放结果音效
      playResultSound(rarity)

      // 确保状态正确设置
      isSpinning.value = false
      showDialogue.value = false

      // 强制显示结果弹窗
      console.log('🎁 准备显示结果弹窗:', {
        currentCard: currentCard.value?.name,
        showResult: showResult.value
      })

      // 使用nextTick确保DOM更新
      await new Promise(resolve => {
        showResult.value = true
        setTimeout(() => {
          console.log('🎁 弹窗状态最终检查:', {
            showResult: showResult.value,
            isSpinning: isSpinning.value,
            currentCard: currentCard.value?.name,
            modalElement: document.querySelector('.result-modal')
          })
          resolve()
        }, 200)
      })

      console.log('✨ 抽奖完成，结果弹窗应该已显示')
    }

    // 数字3点击处理
    const handleNumber3Click = () => {
      if (!showNumber3.value || number3Collected.value) return

      const success = numberCollector.collectNumber(4, 3, 'time_code_card')
      if (success) {
        number3Collected.value = true
        showNumber3.value = false
        console.log('🎉 成功收集数字3!')

        // 显示收集成功对话
        currentDialogue.value = '一个神秘的数字，似乎代表了什么意义。'
        showDialogue.value = true
      }
    }

    // 收藏卡片
    const collectCard = () => {
      console.log('💝 收藏卡片:', currentCard.value)

      // 检查是否已经收藏过相同类型的卡片
      const existingCard = collectedCards.value.find(card => card.id === currentCard.value.id)

      if (existingCard) {
        // 如果已有相同类型，增加数量
        existingCard.quantity = (existingCard.quantity || 1) + 1
        existingCard.lastObtained = currentCard.value.obtainedAt
        console.log(`📦 增加卡片数量: ${existingCard.name} x${existingCard.quantity}`)
      } else {
        // 如果是新卡片，添加到收藏
        const newCard = {
          ...currentCard.value,
          quantity: 1,
          firstObtained: currentCard.value.obtainedAt,
          lastObtained: currentCard.value.obtainedAt
        }
        collectedCards.value.push(newCard)
        console.log(`🆕 新卡片收藏: ${newCard.name}`)
      }

      // 更新统计数据
      gameStats.cardsCollected++
      gameStats.totalValue += currentCard.value.value

      // 更新稀有度统计
      switch (currentCard.value.rarity) {
        case 'common':
          gameStats.commonCards++
          break
        case 'rare':
          gameStats.rareCards++
          break
        case 'epic':
          gameStats.epicCards++
          break
        case 'special':
          gameStats.specialCards++
          break
      }

      // 检查是否解锁新成就
      checkCardAchievements()

      // 保存到本地存储
      saveGameData()

      console.log('📊 游戏统计:', gameStats)
      console.log('🗂️ 收藏列表:', collectedCards.value)

      closeResult()
      startCooldown()
    }

    // 检查卡片相关成就
    const checkCardAchievements = () => {
      const uniqueCards = collectedCards.value.length
      const totalCards = gameStats.cardsCollected

      // 成就检查逻辑
      const achievements = []

      if (totalCards === 1) {
        achievements.push({
          id: 'first_card',
          title: '初次收藏',
          description: '获得了第一张零食兑换卡'
        })
      }

      if (uniqueCards >= 5) {
        achievements.push({
          id: 'collector',
          title: '收藏家',
          description: '收集了5种不同的零食兑换卡'
        })
      }

      if (gameStats.epicCards >= 1) {
        achievements.push({
          id: 'epic_hunter',
          title: '史诗猎人',
          description: '获得了第一张史诗级零食兑换卡'
        })
      }

      if (gameStats.specialCards >= 1) {
        achievements.push({
          id: 'special_master',
          title: '特殊大师',
          description: '获得了珍贵的特殊零食礼包'
        })
      }

      if (uniqueCards >= 10) {
        achievements.push({
          id: 'complete_collection',
          title: '完美收藏',
          description: '收集了所有类型的零食兑换卡'
        })
      }

      // 显示新解锁的成就
      achievements.forEach(achievement => {
        if (!gameStats.unlockedAchievements) {
          gameStats.unlockedAchievements = []
        }

        if (!gameStats.unlockedAchievements.includes(achievement.id)) {
          gameStats.unlockedAchievements.push(achievement.id)
          showAchievementNotification(achievement)
        }
      })
    }

    // 显示成就通知
    const showAchievementNotification = (achievement) => {
      console.log('🏆 解锁成就:', achievement)
      // TODO: 实现成就通知UI
    }

    // 显示收藏
    const showCollection = () => {
      console.log('🗂️ 显示收藏列表')
      showCollectionModal.value = true
    }

    // 关闭收藏
    const closeCollection = () => {
      showCollectionModal.value = false
    }

    // 保存游戏数据到本地存储
    const saveGameData = () => {
      try {
        const gameData = {
          stats: gameStats,
          cards: collectedCards.value,
          drawnItems: Array.from(drawnItems.value), // 保存已抽到的物品ID
          isWukongLetterUnlocked: isWukongLetterUnlocked.value,
          isDeveloperLetterUnlocked: isDeveloperLetterUnlocked.value,
          lastSaved: new Date().toISOString()
        }
        localStorage.setItem('starWishWheel_gameData', JSON.stringify(gameData))
        console.log('💾 游戏数据已保存')
      } catch (error) {
        console.error('💾 保存游戏数据失败:', error)
      }
    }

    // 加载游戏数据
    const loadGameData = () => {
      try {
        const savedData = localStorage.getItem('starWishWheel_gameData')
        if (savedData) {
          const gameData = JSON.parse(savedData)

          // 恢复统计数据
          Object.assign(gameStats, gameData.stats)

          // 恢复收藏列表
          collectedCards.value = gameData.cards || []

          // 恢复已抽到的物品记录
          if (gameData.drawnItems && Array.isArray(gameData.drawnItems)) {
            drawnItems.value = new Set(gameData.drawnItems)
          }

          // 恢复悟空信件解锁状态
          if (gameData.isWukongLetterUnlocked !== undefined) {
            isWukongLetterUnlocked.value = gameData.isWukongLetterUnlocked
          }

          // 恢复开发者信件解锁状态
          if (gameData.isDeveloperLetterUnlocked !== undefined) {
            isDeveloperLetterUnlocked.value = gameData.isDeveloperLetterUnlocked
          }

          console.log('📂 游戏数据已加载:', {
            totalSpins: gameStats.totalSpins,
            cardsCollected: gameStats.cardsCollected,
            collectedCards: collectedCards.value.length,
            drawnItems: drawnItems.value.size,
            isDeveloperLetterUnlocked: isDeveloperLetterUnlocked.value
          })
        }
      } catch (error) {
        console.error('📂 加载游戏数据失败:', error)
      }
    }

    // 关闭结果弹窗
    const closeResult = () => {
      showResult.value = false
      showDialogue.value = true
      currentDialogue.value = '希望你喜欢这份礼物，期待下次再见~'
    }

    // 开始冷却时间
    const startCooldown = () => {
      cooldownTime.value = 3 // 30秒冷却
      const timer = setInterval(() => {
        cooldownTime.value--
        if (cooldownTime.value <= 0) {
          clearInterval(timer)
          currentDialogue.value = '准备好了吗？让我们再次转动星愿转盘吧~'
        }
      }, 1000)
    }

    // 前往下一章
    const goToNextChapter = () => {
      console.log('🚀 前往第五章')
      // TODO: 实现章节导航
    }

    // 播放旋转音效
    const playSpinSound = () => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        // 创建旋转音效 - 上升的音调
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 2.5)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 3)

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 2)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3)

        oscillator.start()
        oscillator.stop(audioContext.currentTime + 3)
      } catch (error) {
        console.log('🎵 旋转音效播放失败:', error)
      }
    }

    // 播放分阶段音效
    const playPhaseSound = (phase) => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        switch (phase) {
          case 'start':
            // 快速启动音效 - 上升音调
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 1)
            gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 1)
            break

          case 'spin':
            // 匀速旋转音效 - 稳定音调
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
            gainNode.gain.setValueAtTime(0.06, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 1.5)
            break

          case 'suspense':
            // 悬念音效 - 紧张的低频
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
            oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 2)
            gainNode.gain.setValueAtTime(0.04, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)
            oscillator.start()
            oscillator.stop(audioContext.currentTime + 2)
            break
        }
      } catch (error) {
        console.log(`🎵 ${phase}音效播放失败:`, error)
      }
    }

    // 播放结果音效
    const playResultSound = (rarity) => {
      try {
        if (!window.AudioContext && !window.webkitAudioContext) return

        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        if (audioContext.state === 'suspended') audioContext.resume()

        // 根据稀有度播放不同音效
        const soundConfig = {
          common: { frequencies: [523, 659], duration: 0.5, volume: 0.1 },
          rare: { frequencies: [523, 659, 784], duration: 0.8, volume: 0.12 },
          epic: { frequencies: [523, 659, 784, 1047], duration: 1.2, volume: 0.15 },
          special: { frequencies: [523, 659, 784, 1047, 1319], duration: 1.5, volume: 0.18 }
        }

        const config = soundConfig[rarity] || soundConfig.common

        config.frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
            gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.3)
          }, index * 150)
        })
      } catch (error) {
        console.log('🎵 结果音效播放失败:', error)
      }
    }

    // 生命周期
    onMounted(() => {
      console.log('🌙 第四章：白夜的星愿转盘 已加载')
      loadGameData()

      // 添加事件监听器
      window.addEventListener('unlockWukongLetter', () => {
        console.log('🔓 接收到悟空信件解锁事件')
        unlockWukongLetter()
      })

      window.addEventListener('unlockDeveloperLetter', () => {
        console.log('🔓 接收到开发者信件解锁事件')
        unlockDeveloperLetter()
      })

      // 显示欢迎对话
      setTimeout(() => {
        if (gameStats.totalSpins === 0) {
          currentDialogue.value = '欢迎来到星愿转盘，让我为你准备一份特别的礼物吧~'
        } else {
          currentDialogue.value = `欢迎回来！你已经收集了 ${gameStats.cardsCollected} 张卡片，继续转动转盘吧~`
        }
      }, 1000)
    })

    onUnmounted(() => {
      // 移除事件监听器
      window.removeEventListener('unlockWukongLetter', unlockWukongLetter)
      window.removeEventListener('unlockDeveloperLetter', unlockDeveloperLetter)
    })

    return {
      // 状态
      isSpinning,
      showDialogue,
      showResult,
      showCollectionModal,
      showNavigationButton,
      cooldownTime,
      wheelRef,
      highlightedSector,
      currentSpeed,
      currentDialogue,
      currentCard,
      wheelSectors,
      gameStats,
      collectedCards,
      spiritImageUrl,
      isDeveloperLetterUnlocked,

      // 方法
      getRewardOptionStyle,
      getRarityText,
      getParticleStyle,
      spinWheel,
      collectCard,
      closeResult,
      showCollection,
      closeCollection,
      goToNextChapter,
      saveGameData,
      loadGameData,
      unlockWukongLetter,
      unlockDeveloperLetter,
      getSpinStatus,
      checkSpinLimit,
      getCurrentMaxSpins,

      // 数字收集相关
      showNumber3,
      number3Collected,
      handleNumber3Click
    }
  }
}
</script>

<style scoped>
/* 基础布局样式 */
.chapter4-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
    "title"
    "character"
    "wheel"
    "action"
    "navigation";
  align-items: center;
  justify-items: center;
  padding: 20px;
  gap: 20px;
}

/* 星光粒子背景 */
.chapter4-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20px 30px, #ffffff, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #ffffff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #ffffff, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: starTwinkle 20s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* 章节标题 */
.chapter-title {
  grid-area: title;
  text-align: center;
  z-index: 10;
  width: 100%;
}

.chapter-title h2 {
  font-size: 28px;
  color: #ffffff;
  margin: 0 0 10px 0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

.chapter-subtitle {
  font-size: 16px;
  color: #b8c6db;
  margin: 0;
  opacity: 0.9;
}

/* 白夜角色区域 */
.baiye-character {
  grid-area: character;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
}

.character-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.baiye-sprite {
  font-size: 60px;
  animation: characterFloat 4s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
  cursor: pointer;
  transition: all 0.3s ease;
}

.baiye-sprite:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
}

@keyframes characterFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
    filter: drop-shadow(0 0 25px rgba(255, 255, 255, 0.8));
  }
}

.character-dialogue {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 12px 20px;
  max-width: 300px;
  text-align: center;
}

.character-dialogue p {
  margin: 0;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.4;
}

/* 数字显示样式 */
.number-display {
  position: absolute;
  cursor: pointer;
  z-index: 15;
  transition: all 0.3s ease;
  animation: starGlow 2s ease-in-out infinite;
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

/* 数字3的位置 */
.number-3 {
  top: 25%;
  left: 25%;
}

@keyframes starGlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* 抽奖系统容器 */
.lottery-system-container {
  grid-area: wheel;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 1fr auto;
  grid-template-areas:
    "left-wand central-wheel right-spirit"
    "bottom-reward bottom-reward bottom-reward";
  align-items: center;
  justify-items: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  max-height: 400px;
  gap: 15px;
  position: relative;
}

/* 左侧魔法杖 */
.left-magic-wand {
  grid-area: left-wand;
  font-size: 40px;
  transform-origin: center center;
  animation: wandIdle 2s ease-in-out infinite;
}

.left-magic-wand.waving {
  animation: wandWaving 0.5s ease-in-out infinite;
}

/* 中央指针容器 */
.central-pointer-container {
  grid-area: central-wheel;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 280px;
  height: 280px;
  max-height: 300px;
}

/* 奖励选项圆环 */
.reward-circle {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

/* 奖励选项 */
.reward-option {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  transform-origin: center center;
}

.reward-option.highlighted {
  transform: translate(-50%, -50%) scale(1.2);
  border-color: rgba(255, 215, 0, 0.8);
  box-shadow:
    0 0 20px rgba(255, 215, 0, 0.6),
    inset 0 0 10px rgba(255, 255, 255, 0.3);
  animation: optionPulse 0.5s ease-in-out infinite;
}

.option-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
}

.option-icon {
  font-size: 20px;
  margin-bottom: 2px;
}

.option-label {
  font-size: 8px;
  color: white;
  text-align: center;
  line-height: 1;
}



/* 右侧精灵容器 */
.right-spirit-container {
  grid-area: right-spirit;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 100%;
  transform: translate(0px, -170px)
}

.spirit-circle {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  animation: spiritFloat 4s ease-in-out infinite;
}

.spirit-circle.casting {
  animation: spiritCasting 3s ease-in-out;
  border-color: rgba(255, 215, 0, 0.6);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}

.spirit-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.spirit-image.casting {
  transform: scale(1.1);
  filter: brightness(1.2) saturate(1.3);
}

/* 精灵光环 */
.spirit-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.spirit-aura.active .aura-ring {
  animation: auraExpand 2s ease-out infinite;
}

.spirit-aura .ring-1 {
  width: 140px;
  height: 140px;
  border: 2px solid rgba(255, 215, 0, 0.4);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 0s;
}

.spirit-aura .ring-2 {
  width: 160px;
  height: 160px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 0.5s;
}

/* 底部奖励展示 - 紧凑版 */
.bottom-reward-display {
  grid-area: bottom-reward;
  margin-top: 10px;
  animation: rewardAppear 0.5s ease-out;
  max-height: 80px;
  overflow: hidden;
}

.bottom-reward-display .reward-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 16px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 50px;
  max-height: 60px;
}

.bottom-reward-display .card-icon {
  font-size: 24px;
  margin: 0;
  animation: iconPulse 2s ease-in-out infinite;
  flex-shrink: 0;
}

.bottom-reward-display .card-name {
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  margin: 0;
}

/* 动画关键帧 */
@keyframes wandIdle {
  0%, 100% { transform: rotate(-15deg); }
  50% { transform: rotate(15deg); }
}

@keyframes wandWaving {
  0%, 100% { transform: rotate(-45deg); }
  25% { transform: rotate(45deg); }
  50% { transform: rotate(-45deg); }
  75% { transform: rotate(45deg); }
}

@keyframes pointerPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50% { transform: translateX(-50%) scale(1.1); }
}

@keyframes pointerSpinning {
  0%, 100% { transform: scale(1.2); }
  50% { transform: scale(1.3); }
}

@keyframes optionPulse {
  0%, 100% {
    box-shadow:
      0 0 20px rgba(255, 215, 0, 0.6),
      inset 0 0 10px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 0 30px rgba(255, 215, 0, 0.8),
      inset 0 0 15px rgba(255, 255, 255, 0.5);
  }
}

@keyframes spiritFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes spiritCasting {
  0%, 100% { transform: translateY(0px) scale(1); }
  25% { transform: translateY(-4px) scale(1.05); }
  50% { transform: translateY(-12px) scale(1.1); }
  75% { transform: translateY(-4px) scale(1.05); }
}

@keyframes wheelGlow {
  0%, 100% {
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.3),
      inset 0 0 30px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 40px rgba(255, 255, 255, 0.4),
      inset 0 0 40px rgba(255, 255, 255, 0.15);
  }
}

@keyframes auraExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

@keyframes rewardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* 移动端适配 */
@media (max-width: 768px) {
.right-spirit-container {
    /* 移动端的相应调整 */
    transform: translate(0px, -170px)
  }

  .lottery-system-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "left-wand"
      "central-wheel"
      "right-spirit"
      "bottom-reward";
    gap: 15px;
  }

  .central-pointer-container {
    width: 220px;
    height: 220px;
    max-height: 250px;
  }

  .lottery-wheel {
    width: 200px;
    height: 200px;
  }

  .spirit-circle {
    width: 100px;
    height: 100px;
  }

  .left-magic-wand {
    font-size: 30px;
  }

  /* 移动端奖励卡片优化 */
  .bottom-reward-display {
    margin-top: 5px;
    max-height: 60px;
  }

  .bottom-reward-display .reward-card {
    padding: 6px 12px;
    min-height: 40px;
    max-height: 45px;
    gap: 6px;
  }

  .bottom-reward-display .card-icon {
    font-size: 20px;
  }

  .bottom-reward-display .card-name {
    font-size: 12px;
  }
}

/* 白夜精灵 */
.night-spirit {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: spiritFloat 4s ease-in-out infinite;
}

.night-spirit.casting {
  animation: spiritCasting 3s ease-in-out;
}

@keyframes spiritFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes spiritCasting {
  0%, 100% { transform: translateY(0px) scale(1); }
  25% { transform: translateY(-5px) scale(1.05); }
  50% { transform: translateY(-15px) scale(1.1); }
  75% { transform: translateY(-5px) scale(1.05); }
}

/* 精灵本体 */
.spirit-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

/* 精灵图片样式 */
.spirit-image {
  width: 200px;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: 20px;
  filter:
    drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))
    drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
  transition: all 0.3s ease;
}

.spirit-image.casting {
  transform: scale(1.1);
  filter:
    drop-shadow(0 12px 24px rgba(0, 0, 0, 0.4))
    drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))
    brightness(1.1)
    saturate(1.2);
}

/* 移动端优化 */
@media (max-width: 768px) {
  .spirit-image {
    width: 150px;
    max-height: 200px;
  }
}

/* 魔法杖 */
.magic-wand {
  position: absolute;
  top: 30%;
  right: -30px;
  font-size: 35px;
  transform-origin: bottom center;
  animation: wandIdle 2s ease-in-out infinite;
  z-index: 10;
}

.magic-wand.waving {
  animation: wandWaving 0.5s ease-in-out infinite;
}

@keyframes wandIdle {
  0%, 100% { transform: rotate(-10deg); }
  50% { transform: rotate(10deg); }
}

@keyframes wandWaving {
  0%, 100% { transform: rotate(-30deg); }
  25% { transform: rotate(30deg); }
  50% { transform: rotate(-30deg); }
  75% { transform: rotate(30deg); }
}

.wand-stick {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.wand-sparkles {
  position: absolute;
  top: -10px;
  left: -5px;
  animation: sparklesTwinkle 1s ease-in-out infinite;
}

@keyframes sparklesTwinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* 魔法光环 */
.magic-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.magic-aura.active .aura-ring {
  animation: auraExpand 2s ease-out infinite;
}

.aura-ring {
  position: absolute;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 180px;
  height: 180px;
  animation-delay: 0s;
}

.ring-2 {
  width: 220px;
  height: 220px;
  animation-delay: 0.3s;
}

.ring-3 {
  width: 260px;
  height: 260px;
  animation-delay: 0.6s;
}

@keyframes auraExpand {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

/* 星光粒子 */
.star-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.star-particles.active .particle {
  animation: particleOrbit 3s linear infinite;
}

.particle {
  position: absolute;
  font-size: 16px;
  transform: translate(var(--particle-x), var(--particle-y));
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes particleOrbit {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translate(var(--particle-x), var(--particle-y)) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(var(--particle-x), var(--particle-y)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(calc(var(--particle-x) * 1.5), calc(var(--particle-y) * 1.5)) scale(0.5);
  }
}

/* 奖励展示区域 */
.reward-display {
  margin-top: 30px;
  animation: rewardAppear 0.5s ease-out;
}

@keyframes rewardAppear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.reward-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.reward-card .card-icon {
  font-size: 40px;
  margin-bottom: 10px;
  animation: iconPulse 2s ease-in-out infinite;
}

.reward-card .card-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes wheelGlow {
  0%, 100% {
    box-shadow:
      0 0 30px rgba(255, 255, 255, 0.3),
      inset 0 0 30px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 50px rgba(255, 255, 255, 0.5),
      inset 0 0 50px rgba(255, 255, 255, 0.2);
  }
}

.star-wheel.spinning {
  /* 旋转角度由JavaScript动态设置 */
  animation: none; /* 旋转时停止发光动画 */
}

/* 转盘扇形区域 */
.wheel-sector {
  position: absolute;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.wheel-sector:hover {
  transform: scale(1.02);
  z-index: 5;
}

.wheel-sector.common {
  background:
    linear-gradient(45deg, rgba(255, 255, 255, 0.25) 0%, rgba(200, 200, 200, 0.35) 100%),
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.wheel-sector.rare {
  background:
    linear-gradient(45deg, rgba(0, 123, 255, 0.35) 0%, rgba(0, 86, 179, 0.45) 100%),
    radial-gradient(circle at 30% 30%, rgba(0, 123, 255, 0.2) 0%, transparent 70%);
  box-shadow: inset 0 0 20px rgba(0, 123, 255, 0.2);
}

.wheel-sector.epic {
  background:
    linear-gradient(45deg, rgba(138, 43, 226, 0.35) 0%, rgba(102, 51, 153, 0.45) 100%),
    radial-gradient(circle at 30% 30%, rgba(138, 43, 226, 0.2) 0%, transparent 70%);
  box-shadow: inset 0 0 20px rgba(138, 43, 226, 0.2);
}

.wheel-sector.special {
  background:
    linear-gradient(45deg, rgba(255, 215, 0, 0.35) 0%, rgba(255, 140, 0, 0.45) 100%),
    radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
  box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2);
  animation: specialGlow 2s ease-in-out infinite;
}

@keyframes specialGlow {
  0%, 100% {
    box-shadow: inset 0 0 20px rgba(255, 215, 0, 0.2);
  }
  50% {
    box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.4);
  }
}

/* 扇形高亮效果 - 增强版 */
.wheel-sector.highlighted {
  transform: scale(1.1) !important;
  z-index: 20 !important;
  border: 3px solid rgba(255, 215, 0, 0.9) !important;
  box-shadow:
    0 0 40px rgba(255, 215, 0, 1),
    0 0 60px rgba(255, 215, 0, 0.6),
    inset 0 0 30px rgba(255, 255, 255, 0.4) !important;
  animation: sectorHighlightEnhanced 0.8s ease-in-out infinite !important;
  filter: brightness(1.3) saturate(1.2) !important;
}

@keyframes sectorHighlightEnhanced {
  0%, 100% {
    transform: scale(1.1);
    box-shadow:
      0 0 40px rgba(255, 215, 0, 1),
      0 0 60px rgba(255, 215, 0, 0.6),
      inset 0 0 30px rgba(255, 255, 255, 0.4);
    filter: brightness(1.3) saturate(1.2);
  }
  50% {
    transform: scale(1.15);
    box-shadow:
      0 0 50px rgba(255, 215, 0, 1),
      0 0 80px rgba(255, 215, 0, 0.8),
      inset 0 0 40px rgba(255, 255, 255, 0.6);
    filter: brightness(1.5) saturate(1.4);
  }
}

.sector-content {
  text-align: center;
  color: white;
  font-size: 12px;
  transform: rotate(-22.5deg); /* 调整文字方向 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.sector-icon {
  font-size: 22px;
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  animation: sectorIconFloat 3s ease-in-out infinite;
}

@keyframes sectorIconFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.sector-label {
  font-size: 10px;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

/* 转盘指针 - 可旋转版本 */
.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -180px; /* 指向转盘顶部 */
  font-size: 45px;
  z-index: 25;
  cursor: pointer;
  transform-origin: center center;
  /* 初始transform，会被JavaScript动态更新 */
  transform: translate(-50%, -50%) rotate(0deg);
  animation: pointerEnhancedGlow 2s ease-in-out infinite;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.6),
    0 0 30px rgba(255, 215, 0, 0.4);
}

.wheel-pointer::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  animation: pointerHalo 3s ease-in-out infinite;
}

.wheel-pointer:hover {
  transform: translate(-50%, -50%) scale(1.15);
  animation: pointerHoverGlow 1s ease-in-out infinite;
}

@keyframes pointerEnhancedGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9));
    transform: translateX(-50%) rotate(-3deg);
  }
  25% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
    transform: translateX(-50%) rotate(0deg);
  }
  50% {
    filter: drop-shadow(0 0 35px rgba(255, 215, 0, 1));
    transform: translateX(-50%) rotate(3deg);
  }
  75% {
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
    transform: translateX(-50%) rotate(0deg);
  }
}

@keyframes pointerHalo {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
}

@keyframes pointerHoverGlow {
  0%, 100% {
    filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1));
  }
}

/* 指针旋转时的特殊效果 */
.wheel-pointer.spinning {
  animation: pointerSpinningGlow 0.5s ease-in-out infinite;
  font-size: 50px;
  filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
}

@keyframes pointerSpinningGlow {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1));
  }
  50% {
    transform: translateX(-50%) scale(1.1);
    filter: drop-shadow(0 0 45px rgba(255, 215, 0, 1));
  }
}

/* 操作按钮 */
.action-area {
  grid-area: action;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: center;
}

.button-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.spin-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 25px;
  padding: 15px 30px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.collection-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 20px;
  padding: 12px 20px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(240, 147, 251, 0.3);
}

.collection-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.4);
}

.collection-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 结果弹窗 - 确保显示 */
.result-modal {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  background: rgba(0, 0, 0, 0.85) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 9999 !important;
  backdrop-filter: blur(5px);
  animation: modalFadeIn 0.3s ease-out;
  pointer-events: auto !important;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

.result-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 450px;
  width: 90%;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: cardSlideIn 0.5s ease-out;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

@keyframes cardSlideIn {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-header h3 {
  margin: 0;
  color: white;
  font-size: 24px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

/* 卡片展示 */
.card-display {
  margin-bottom: 25px;
}

.card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: cardShine 2s ease-in-out infinite;
}

@keyframes cardShine {
  0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.card-icon {
  font-size: 50px;
  margin-bottom: 15px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-name {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.card-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  line-height: 1.4;
}

.card-rarity {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 收藏按钮 */
.collect-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 20px;
  padding: 12px 24px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.collect-btn:hover {
  transform: scale(1.05);
}

/* 收藏弹窗 */
.collection-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.collection-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.collection-header h3 {
  margin: 0;
  color: white;
  font-size: 24px;
}

.collection-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.collection-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.collection-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.collection-card.common {
  border-color: rgba(255, 255, 255, 0.3);
}

.collection-card.rare {
  border-color: rgba(0, 123, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 123, 255, 0.2);
}

.collection-card.epic {
  border-color: rgba(138, 43, 226, 0.5);
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.2);
}

.collection-card.special {
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  animation: specialCardGlow 2s ease-in-out infinite;
}

@keyframes specialCardGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.2); }
  50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.4); }
}

.collection-card .card-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.collection-card .card-name {
  font-size: 12px;
  color: white;
  margin-bottom: 5px;
  font-weight: bold;
}

.collection-card .card-quantity {
  font-size: 14px;
  color: #FFD700;
  margin-bottom: 5px;
  font-weight: bold;
}

.collection-card .card-rarity {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.empty-collection {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  padding: 40px;
}

.empty-collection p {
  margin: 10px 0;
  font-size: 16px;
}

/* 导航按钮 */
.navigation-button {
  grid-area: navigation;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 30px;
}

.next-chapter-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
}

.next-chapter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(240, 147, 251, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chapter4-container {
    padding: 15px;
    gap: 15px;
    grid-template-rows: auto auto 1fr auto auto;
  }

  .wheel-container {
    min-height: 280px;
  }
  
  .chapter-title h2 {
    font-size: 24px;
  }
  
  .chapter-subtitle {
    font-size: 14px;
  }
  
  .baiye-sprite {
    font-size: 50px;
  }
  
  .star-wheel {
    width: 250px;
    height: 250px;
  }
  
  .sector-icon {
    font-size: 16px;
  }
  
  .sector-content {
    font-size: 10px;
  }
  
  .spin-button {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  .result-content {
    margin: 20px;
    padding: 20px;
  }
  
  .navigation-button {
    bottom: 20px;
    right: 20px;
  }
}
</style>

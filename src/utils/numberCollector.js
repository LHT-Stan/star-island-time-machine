// 全局数字收集器 - 跨章节数字彩蛋系统
// 基于重要日期：8月11日(相遇) + 7月30日(菲儿生日)

class NumberCollector {
  constructor() {
    this.targetSequence = [8, 1, 1, 7, 3, 0]  // 目标序列：8月11日 + 7月30日
    this.storageKey = 'starIsland_numberCollection'
    this.init()
  }

  // 初始化收集器
  init() {
    const saved = this.loadProgress()
    this.collectedNumbers = saved.collectedNumbers || []
    this.chapterProgress = saved.chapterProgress || {}
    this.isComplete = saved.isComplete || false
    this.unlockedRewards = saved.unlockedRewards || []
  }

  // 保存进度到localStorage
  saveProgress() {
    const data = {
      collectedNumbers: this.collectedNumbers,
      chapterProgress: this.chapterProgress,
      isComplete: this.isComplete,
      unlockedRewards: this.unlockedRewards,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data))
    console.log('💾 数字收集进度已保存:', data)
  }

  // 加载进度
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return saved ? JSON.parse(saved) : {}
    } catch (error) {
      console.error('❌ 加载数字收集进度失败:', error)
      return {}
    }
  }

  // 收集数字
  collectNumber(chapterNumber, number, source = '') {
    console.log(`🔢 尝试收集数字: ${number} (来自第${chapterNumber}章 - ${source})`)

    // 检查是否已经收集过这个位置的数字
    const positionKey = `chapter${chapterNumber}_${source}`
    if (this.chapterProgress[positionKey]) {
      console.log('⚠️ 该位置的数字已经收集过了')
      return false
    }

    // 检查数字是否在目标序列中
    const expectedIndex = this.collectedNumbers.length
    if (expectedIndex >= this.targetSequence.length) {
      console.log('✅ 所有数字已收集完成')
      return false
    }

    const expectedNumber = this.targetSequence[expectedIndex]
    if (number !== expectedNumber) {
      console.log(`❌ 数字不匹配! 期望: ${expectedNumber}, 实际: ${number}`)
      return false
    }

    // 收集成功
    this.collectedNumbers.push(number)
    this.chapterProgress[positionKey] = {
      number: number,
      timestamp: new Date().toISOString(),
      chapter: chapterNumber,
      source: source
    }

    console.log(`✅ 成功收集数字 ${number}! 进度: ${this.collectedNumbers.length}/${this.targetSequence.length}`)

    // 检查是否完成收集
    if (this.collectedNumbers.length === this.targetSequence.length) {
      this.isComplete = true
      this.unlockFinalRewards()
      console.log('🎉 数字序列收集完成！解锁最终奖励！')
    }

    this.saveProgress()
    this.triggerProgressEvent()
    return true
  }

  // 获取收集进度
  getProgress() {
    return {
      collected: this.collectedNumbers.length,
      total: this.targetSequence.length,
      percentage: Math.round((this.collectedNumbers.length / this.targetSequence.length) * 100),
      isComplete: this.isComplete,
      nextExpected: this.collectedNumbers.length < this.targetSequence.length 
        ? this.targetSequence[this.collectedNumbers.length] 
        : null,
      collectedNumbers: [...this.collectedNumbers],
      chapterProgress: { ...this.chapterProgress }
    }
  }

  // 检查指定章节的数字是否应该显示
  shouldShowNumber(chapterNumber, number) {
    // 找到这个数字在目标序列中的位置
    let targetIndex = -1
    let sameNumberCount = 0

    for (let i = 0; i < this.targetSequence.length; i++) {
      if (this.targetSequence[i] === number) {
        if (sameNumberCount === this.collectedNumbers.filter(n => n === number).length) {
          targetIndex = i
          break
        }
        sameNumberCount++
      }
    }

    if (targetIndex === -1) {
      return false // 数字不在序列中或已收集完
    }

    // 只有当前面的数字都收集完了，才显示这个数字
    return this.collectedNumbers.length >= targetIndex
  }

  // 检查特定章节是否已收集
  hasCollectedFromChapter(chapterNumber, source = '') {
    const positionKey = `chapter${chapterNumber}_${source}`
    return !!this.chapterProgress[positionKey]
  }

  // 获取收集提示
  getHint() {
    const progress = this.getProgress()
    const hints = [
      "寻找重要日期的第一个数字...", // 0个
      "相遇时刻的第二个数字在等待...", // 1个  
      "还有一个数字完成这个日期...", // 2个
      "现在寻找另一个特殊日子的开始...", // 3个
      "生日月份的下一个数字...", // 4个
      "最后一个数字即将揭晓...", // 5个
      "时光密码已经完整！" // 6个
    ]
    return hints[progress.collected] || "继续探索..."
  }

  // 解锁最终奖励
  unlockFinalRewards() {
    const rewards = [
      'developer_letter_unlock', // 开发者信件解锁
      'time_treasure_box', // 时光宝盒
      'memory_photo_wall', // 回忆照片墙
      'secret_achievement' // 隐藏成就
    ]

    this.unlockedRewards = [...rewards]

    // 触发各章节的解锁事件
    rewards.forEach(reward => {
      window.dispatchEvent(new CustomEvent('numberCollectionReward', {
        detail: { reward, timestamp: Date.now() }
      }))
    })

    // 触发第四章开发者信件解锁（增加抽奖次数）
    window.dispatchEvent(new CustomEvent('unlockDeveloperLetter'))
    console.log('🔓 触发第四章开发者信件解锁')

    // 触发全局开发者信件弹窗
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showDeveloperLetter', {
        detail: {
          allNumbersCollected: true,
          sequence: this.collectedNumbers,
          timestamp: Date.now()
        }
      }))
      console.log('🎉 触发全局开发者信件弹窗')
    }, 1000) // 延迟1秒显示，让用户看到收集完成的提示
  }

  // 触发进度更新事件
  triggerProgressEvent() {
    window.dispatchEvent(new CustomEvent('numberCollectionProgress', {
      detail: this.getProgress()
    }))
  }

  // 重置收集进度 (调试用)
  reset() {
    localStorage.removeItem(this.storageKey)
    this.init()
    console.log('🔄 数字收集进度已重置')
  }

  // 获取章节数字配置
  getChapterConfig() {
    return {
      1: { number: 8, source: 'crystal_reflection', description: '水晶反射中的数字' },
      2: { number: [1, 1], source: 'starlight_flash', description: '星光闪烁的数字' },
      3: { number: 7, source: 'chouchou_max_stats', description: '臭臭满属性解锁' },
      4: { number: 3, source: 'time_code_card', description: '时光密码卡片' },
      5: { number: 0, source: 'photo_combination', description: '照片组合解锁' }
    }
  }
}

// 创建全局实例
const numberCollector = new NumberCollector()

// 导出实例和类
export { numberCollector, NumberCollector }
export default numberCollector

// 腾讯云COS图片配置
// 基础域名
const COS_BASE_URL = 'https://baiye-1303837911.cos.ap-chengdu.myqcloud.com/images'

// 图片URL配置
export const imageUrls = {
  // 背景图片
  backgrounds: {
    crystalIsland: `${COS_BASE_URL}/Crystal_Island.png`,
    room: `${COS_BASE_URL}/room.jpg`
  },

  // 角色精灵图片
  characters: {
    wukong: `${COS_BASE_URL}/wukong_dog.png`,
    baiye: `${COS_BASE_URL}/baiye.jpg`,
    chouchouSleep: `${COS_BASE_URL}/chouchou_cat1.png`,
    chouchouStretch: `${COS_BASE_URL}/chouhcou_cat2.png`
  },

  // 道具物品图片
  items: {
    card: `${COS_BASE_URL}/card.jpg`,
    giftbox: `${COS_BASE_URL}/giftbox.png`,
    computerTop: `${COS_BASE_URL}/computer-top.png`,
    dragonEgg: `${COS_BASE_URL}/Wyvern_Egg_Fire.png`
  },

  // 照片墙图片
  photos: {
    me: `${COS_BASE_URL}/photo-wall/me.jpg`,
    feier1: `${COS_BASE_URL}/photo-wall/feir1.jpg`,
    feier2: `${COS_BASE_URL}/photo-wall/ferer2.jpg`,
    chouchou: `${COS_BASE_URL}/dog.jpg`,
    wukong: `${COS_BASE_URL}/photo-wall/wukong.jpg`,
    together: `${COS_BASE_URL}/photo-wall/feierandchouchou.jpg`
  },

  // 第三章臭臭图片
  chouchou: {
    main: `${COS_BASE_URL}/dog.jpg` // 第三章使用的臭臭图片
  }
}

// 导出单个图片URL的便捷函数
export const getImageUrl = (category, name) => {
  return imageUrls[category]?.[name] || ''
}

// 导出所有图片URL的扁平化对象（向后兼容）
export const flatImageUrls = {
  // 背景
  roomImageUrl: imageUrls.backgrounds.room,
  crystalIslandImageUrl: imageUrls.backgrounds.crystalIsland,
  
  // 角色
  wukongImageUrl: imageUrls.characters.wukong,
  friendImageUrl: imageUrls.characters.baiye,
  catImageUrl: imageUrls.characters.chouchouSleep,
  catStretchImageUrl: imageUrls.characters.chouchouStretch,
  
  // 道具
  birthdayCardImageUrl: imageUrls.items.card,
  giftboxImageUrl: imageUrls.items.giftbox,
  computerTopImageUrl: imageUrls.items.computerTop,
  dragonEggImageUrl: imageUrls.items.dragonEgg,
  
  // 照片
  photoWallMe: imageUrls.photos.me,
  photoWallFeier1: imageUrls.photos.feier1,
  photoWallFeier2: imageUrls.photos.feier2,
  photoWallChouchou: imageUrls.photos.chouchou,
  photoWallWukong: imageUrls.photos.wukong,
  photoWallTogether: imageUrls.photos.together,
  
  // 第三章
  chouchouMainImage: imageUrls.chouchou.main
}

export default imageUrls

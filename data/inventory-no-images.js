/**
 * 静态库存数据（无本地图片版本）
 * 使用网络图片或不使用图片，可直接运行
 */

const inventory = [
  {
    id: '1',
    name: '儿童玩具熊',
    category: '玩具',
    condition: '良好',
    description: '棕色泰迪熊，约30cm高，柔软舒适，适合3岁以上儿童',
    price: '免费',
    suggestedPrice: '免费',
    tags: ['玩具', '儿童', '毛绒玩具', '泰迪熊', '棕色'],
    // 使用网络图片（示例）
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    donorName: '李女士',
    location: '北京市朝阳区',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: '儿童积木套装',
    category: '玩具',
    condition: '九成新',
    description: '乐高兼容积木，包含200个零件，多种颜色，开发创造力',
    price: '50元',
    suggestedPrice: '50元',
    tags: ['玩具', '儿童', '积木', '乐高', '益智'],
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    donorName: '王先生',
    location: '上海市浦东新区',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    name: '儿童绘本图书',
    category: '书籍',
    condition: '九成新',
    description: '《小王子》精装绘本，彩色插图，适合5-10岁儿童阅读',
    price: '15元',
    suggestedPrice: '15元',
    tags: ['书籍', '儿童', '绘本', '小王子', '教育'],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    donorName: '张女士',
    location: '北京市海淀区',
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    name: 'LED台灯',
    category: '家居用品',
    condition: '良好',
    description: '白色可调光LED台灯，护眼设计，适合学习办公，USB供电',
    price: '30元',
    suggestedPrice: '30元',
    tags: ['家居', '台灯', 'LED', '学习', '护眼'],
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    donorName: '陈先生',
    location: '深圳市南山区',
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    name: '学生书包',
    category: '学习用品',
    condition: '八成新',
    description: '蓝色双肩背包，多个隔层，透气背负系统，适合小学生',
    price: '25元',
    suggestedPrice: '25元',
    tags: ['书包', '学生', '学习', '背包', '蓝色'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    donorName: '刘女士',
    location: '广州市天河区',
    createdAt: '2024-01-11T11:00:00Z',
  },
];

export default inventory;

/**
 * 获取所有物品
 */
export function getAllItems() {
  return inventory;
}

/**
 * 根据 ID 获取物品
 */
export function getItemById(id) {
  return inventory.find((item) => item.id === id);
}

/**
 * 根据类别获取物品
 */
export function getItemsByCategory(category) {
  return inventory.filter((item) => item.category === category);
}

/**
 * 添加新物品到库存
 */
export function addItem(newItem) {
  inventory.push({
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...newItem,
  });
  return inventory;
}

/**
 * 获取所有类别
 */
export function getAllCategories() {
  const categories = [...new Set(inventory.map((item) => item.category))];
  return categories;
}

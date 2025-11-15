# AI ReUse Assistant

一款使用 Expo + React Native 开发的 AI 智能闲置物品管家应用。

## 🎯 功能特性

- **📸 拍照识别捐赠物** - 使用 Claude Vision API 自动识别物品并生成卡片
- **🔍 语义搜索物品** - 使用自然语言描述需求，AI 智能匹配物品
- **💾 物品管理** - 保存识别结果到本地库存
- **🎨 现代化 UI** - 简洁卡片式设计，白底阴影圆角

## 📦 技术栈

- **框架**: Expo SDK 51 + React Native
- **导航**: React Navigation (Stack Navigator)
- **AI**: Google Gemini API (Vision + Semantic Search)
- **图片**: expo-image-picker

## 🚀 快速开始

### 1. ✅ API Key 已配置

项目已配置 Gemini API Key，可以直接使用！

**如需更换 API Key：**
- 打开 `lib/ai.js` 文件
- 在第 7 行修改 `GEMINI_API_KEY`
- 获取免费 API Key：https://makersuite.google.com/app/apikey

### 2. 启动开发服务器

\`\`\`bash
npx expo start
\`\`\`

### 3. 在手机上测试

- 安装 **Expo Go** App（iOS/Android）
- 扫描终端中显示的二维码
- 应用将在 Expo Go 中打开

## 📁 项目结构

\`\`\`
/
├── App.js                  # 导航容器配置
├── screens/
│   ├── HomeScreen.js       # 首页
│   ├── ImageScreen.js      # 拍照识别页面
│   └── SearchScreen.js     # 语义搜索页面
├── lib/
│   └── ai.js               # Claude API 调用逻辑
├── data/
│   ├── inventory.js        # 静态库存数据（5个示例）
│   └── README.md           # 数据说明文档
├── assets/                 # 应用图标和静态资源
├── app.json                # Expo 配置
└── package.json            # 依赖配置
\`\`\`

## 🎮 使用流程

### 拍照识别流程
1. 在首页点击"📸 拍照识别捐赠物"
2. 选择图片或拍照
3. 点击"🤖 开始识别"
4. 查看 AI 生成的物品卡片（名称、类别、状态、描述、价格、标签）
5. 点击"💾 保存到库存"

### 语义搜索流程
1. 在首页点击"🔍 语义搜索物品"
2. 输入自然语言查询（如："想要适合小孩的玩具"）
3. 点击"🔍 智能搜索"
4. 查看匹配结果（含图片、匹配度、匹配原因、标签）
5. 点击"📞 联系捐赠者"查看详情

## 📝 已安装依赖

\`\`\`json
{
  "@react-navigation/native": "^7.1.20",
  "@react-navigation/stack": "^7.6.4",
  "expo": "~51.0.0",
  "expo-image-picker": "^17.0.8",
  "react-native-safe-area-context": "4.10.5",
  "react-native-screens": "3.31.1"
}
\`\`\`

## ⚠️ 重要提示

1. **API Key 已配置**：项目已配置 Gemini API Key，可直接使用
2. **网络连接**：需要网络连接才能调用 Gemini API 和加载库存图片
3. **权限**：首次使用相机和相册时需要授予权限
4. **免费额度**：Gemini 1.5 Flash 每分钟限制 15 次请求（免费版）

## 🐛 常见问题

### Q: 图片识别失败
**A:** 检查：
1. Gemini API Key 是否有效（已配置在 `lib/ai.js`）
2. 网络连接是否正常
3. 图片是否选择成功（查看控制台错误信息）
4. 是否超出 Gemini 免费额度（每分钟 15 次请求）

### Q: 搜索没有结果
**A:**
1. 确保库存中有物品数据（`data/inventory.js`）
2. 尝试换个描述方式
3. 检查网络连接

### Q: 如何更换为自己的 Gemini API Key？
**A:**
1. 访问 https://makersuite.google.com/app/apikey 获取免费 API Key
2. 打开 `lib/ai.js` 文件
3. 在第 7 行替换 `GEMINI_API_KEY` 的值

## 📄 许可证

MIT License

## 👨‍💻 开发者

使用 Claude Code 和 Expo 构建

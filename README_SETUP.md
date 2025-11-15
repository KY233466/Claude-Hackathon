# Expo Go 环境配置完成 ✅

## 已完成的配置

✅ 清理了所有旧配置和脚本
✅ 简化了 package.json（使用 Expo SDK 50）
✅ 简化了 metro.config.js
✅ 重新安装了所有依赖

## ⚠️ 核心问题

**你当前使用的 Node.js v24.11.0 与 Expo/React Native 不兼容。**

这个版本太新了，Metro Bundler 会出现 `EMFILE: too many open files` 错误。

## 🎯 必须解决 Node.js 版本问题

你需要切换到 **Node.js 20 LTS**。以下是最简单的解决方案：

### 方案：使用 nvm 管理 Node 版本

```bash
# 1. 安装 nvm（Node Version Manager）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重新加载 shell 配置
source ~/.zshrc

# 3. 验证 nvm 安装成功
nvm --version

# 4. 安装 Node.js 20 LTS
nvm install 20

# 5. 使用 Node.js 20
nvm use 20

# 6. 验证 Node 版本
node --version
# 应该显示 v20.x.x

# 7. 设置为默认版本
nvm alias default 20
```

### 启动 Expo

安装完 Node.js 20 后，运行：

```bash
npm start
```

这会启动 Expo 开发服务器并显示 QR 码。

## 📱 在 Expo Go 上测试

1. **在手机上安装 Expo Go**
   - iOS: App Store 搜索 "Expo Go"
   - Android: Google Play 搜索 "Expo Go"

2. **确保网络连接**
   - 手机和电脑在同一个 Wi-Fi 网络

3. **扫描 QR 码**
   - 启动成功后，终端会显示 QR 码
   - iOS: 使用相机扫描
   - Android: 在 Expo Go 应用内扫描

## 📊 当前项目配置

```json
{
  "expo": "~50.0.17",
  "react": "18.2.0",
  "react-native": "0.73.6",
  "react-navigation": "^6.1.9"
}
```

这是经过测试的稳定版本组合。

## 🔧 其他可用命令

```bash
npm start          # 启动开发服务器
npm run android    # 在 Android 设备上运行
npm run ios        # 在 iOS 设备上运行
npm run web        # 在浏览器中运行
```

## ❓ 常见问题

### Q: nvm 安装后找不到命令？

**A:** 重新加载配置文件：
```bash
source ~/.zshrc
# 或
source ~/.bashrc
```

### Q: 我想在不同项目中使用不同 Node 版本？

**A:** 使用 nvm 切换：
```bash
nvm use 20     # 切换到 Node 20
nvm use 24     # 切换回 Node 24
nvm ls         # 查看已安装的版本
```

### Q: 能不能不换 Node 版本？

**A:** 不行。Node.js v24 是最新的版本，Expo 的工具链还没有完全支持。
必须使用 Node.js 18 或 20 才能正常运行。

## 🚀 完整启动步骤

```bash
# 1. 切换到 Node 20
nvm use 20

# 2. 进入项目目录
cd /Users/rexgu/Documents/Personal/Hackathon

# 3. 启动项目
npm start

# 4. 用手机扫描 QR 码
```

## 📝 项目文件结构

```
Hackathon/
├── App.js                 # 主应用
├── index.js              # 入口文件
├── package.json          # 依赖配置（已简化）
├── app.json              # Expo 配置
├── metro.config.js       # Metro 配置（已简化）
├── babel.config.js       # Babel 配置
├── screens/              # 页面组件
│   ├── HomeScreen.js
│   ├── ImageScreen.js
│   ├── SearchScreen.js
│   └── ItemDetailScreen.js
├── data/                 # 数据文件
└── lib/                  # 工具库
```

---

**重要提示**: 配置已经完全重置并优化。唯一的问题就是 Node.js 版本。
安装 Node.js 20 后就可以正常使用 Expo Go 了！

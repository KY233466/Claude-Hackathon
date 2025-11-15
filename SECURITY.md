# 🔐 安全说明

## API Key 保护

本项目已经配置了完善的 API key 保护机制，确保敏感信息不会被提交到 Git 仓库。

### ✅ 已实施的安全措施

1. **配置文件分离**
   - API key 存储在 `lib/config.js` 文件中
   - 该文件中的 key 为占位符 `YOUR_API_KEY_HERE`
   - 实际使用时需要替换为真实的 API key

2. **.gitignore 配置**
   - 已添加环境变量文件保护：`.env`, `.env.local`, `.env.*.local`
   - 已排除测试文件：`test-gemini-api.js`
   - 已排除 API key 相关文件：`**/api-keys.js`, `**/secrets.js`
   - 已排除 Claude 工作空间：`.claude/`

3. **环境变量模板**
   - 提供了 `.env.example` 作为配置模板
   - 使用者可以复制并填入自己的 API key

### 📝 配置步骤

1. **获取 API Key**
   ```
   访问: https://makersuite.google.com/app/apikey
   登录 Google 账号并创建免费 API key
   ```

2. **配置到项目**
   ```bash
   # 打开配置文件
   nano lib/config.js

   # 替换占位符
   export const GEMINI_API_KEY = 'your_actual_api_key_here';
   ```

3. **验证配置**
   ```bash
   # 启动应用测试
   npm start
   ```

### ⚠️ 重要提示

- **永远不要**将真实的 API key 提交到 Git
- **永远不要**在公开场合分享 API key
- 如果不小心泄露了 API key，立即在 Google Cloud Console 中撤销并重新生成

### 🔍 验证安全性

运行以下命令确认敏感文件没有被跟踪：

```bash
# 检查 git 状态
git status

# 确认 test-gemini-api.js 不在列表中
git ls-files | grep test-gemini-api.js

# 应该返回空结果（文件被忽略）
```

### 📊 已保护的文件

- ✅ `test-gemini-api.js` - 包含测试用 API key
- ✅ `.env` 及相关环境变量文件
- ✅ `.claude/` - Claude Code 工作空间
- ✅ `node_modules/` - 依赖包
- ✅ `.expo/` - Expo 缓存

---

如有安全问题或建议，请通过 GitHub Issues 联系。

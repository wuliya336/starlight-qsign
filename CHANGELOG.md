# 变更日志

## 2.6.0 (2025-01-19)

### ✨ 新功能

* **components:** 优化插件初始化和日志输出 ([4bc315c](https://github.com/wuliya336/starlight-qsign/commit/4bc315ce26fecdc92e36437f9ee447893bf30203))
* **pre-commit:** 更新配置以支持自动修复和每周自动更新 ([7e675cd](https://github.com/wuliya336/starlight-qsign/commit/7e675cd25f765f64ed656cfe62a1bbff15fcc9fc))
* **workflows:** 替换自动更新版本的工作流，添加版本标签和改进的 PR 创建步骤 ([2302e74](https://github.com/wuliya336/starlight-qsign/commit/2302e74c7093ee7a8794a903e18c12f487d37051))
* **workflows:** 添加自动更新 package.json 版本的工作流 ([26863e2](https://github.com/wuliya336/starlight-qsign/commit/26863e2f85ece999519562727d73cdf179b1b553))
* **workflows:** 修复 Pull Request 创建逻辑，优化提示信息 ([529adbd](https://github.com/wuliya336/starlight-qsign/commit/529adbdd8dd480c0191721ca5c602d992dd5a6a7))
* **workflows:** 优化自动更新 package.json 版本的工作流 ([9b94030](https://github.com/wuliya336/starlight-qsign/commit/9b9403054ac6b0a32405a2585a09051b6d53ce74))

### 🐛 修复

* **signList:** 更新签名数据获取路径 ([540c436](https://github.com/wuliya336/starlight-qsign/commit/540c436d20eb7b496f994d8a181f893246682243))
* **signList:** 修复群聊中获取签名失败时的处理逻辑 ([7657944](https://github.com/wuliya336/starlight-qsign/commit/765794400d7406621c6d3cdd8241dcdfc2cc7e93))

### ♻️ 重构

* 将 model 目录重命名为 models ([b8770e8](https://github.com/wuliya336/starlight-qsign/commit/b8770e8c6121ec6035ad69ea7042b65030ba9c81))
* 优化代码结构和风格 ([f53a985](https://github.com/wuliya336/starlight-qsign/commit/f53a9858bc62f1da10673a53b9fd66d023db22cc))
* 重构项目并优化资源加载 ([c9cf92f](https://github.com/wuliya336/starlight-qsign/commit/c9cf92f48e84fc1f3d795f127f2b564c8385c082))
* **components:** 将 Bot.js 文件名改为小写的 bot.js ([82928b3](https://github.com/wuliya336/starlight-qsign/commit/82928b354d5d867c6cf2483b0501d4af868ed159))
* **help:** 优化帮助界面渲染逻辑和主题系统 ([4ef6029](https://github.com/wuliya336/starlight-qsign/commit/4ef602982c18e5873409c6b536a1b69d821085b7))
* **model:** 优化群组冷却功能的代码 ([d7ed1a1](https://github.com/wuliya336/starlight-qsign/commit/d7ed1a1e518b99ca2f32f857e45e6713f94dcfc7))
* **models:** 优化 SwitchUtils 获取签名数据逻辑 ([6ad408b](https://github.com/wuliya336/starlight-qsign/commit/6ad408b0155877cd175788fe0305ce8301de41f3))
* **signAddr:** 重构签名地址页面数据获取和展示逻辑 ([a49c6c4](https://github.com/wuliya336/starlight-qsign/commit/a49c6c44bb1d282a369cb3f7987521253cecc726))
* **signList:** 更新 SignUtil 导入路径 ([51138f2](https://github.com/wuliya336/starlight-qsign/commit/51138f220b7b73a708b8a16589cd7f6232b064cf))
* **signList:** 优化代码格式 ([4f921ed](https://github.com/wuliya336/starlight-qsign/commit/4f921edd1f2f8a6776d2b0b4ed2252bf626422d1))
* **signList:** 优化回复消息的代码结构 ([7093017](https://github.com/wuliya336/starlight-qsign/commit/7093017ddcfa6e3d085b365c0d7c7ba9452bffff))
* **signList:** 重构签名列表功能 ([327c254](https://github.com/wuliya336/starlight-qsign/commit/327c25438d258acf62582a6fb540c2cc655a4ae0))
* **signSwitch:** 移除不必要的关键词 ([c128f58](https://github.com/wuliya336/starlight-qsign/commit/c128f58f2e0046b260c9378d6e29d4633cf77451))
* **signSwitch:** 优化签名切换逻辑 ([a34c2d6](https://github.com/wuliya336/starlight-qsign/commit/a34c2d6b4b22bf396b524ae12f2cb1f0e307eccd))
* **signSwitch:** 重构签名切换应用 ([e2bbf6b](https://github.com/wuliya336/starlight-qsign/commit/e2bbf6ba67fdb91603df5c6ad51f32b40b37e48e))
* **signUtil:** 优化签名工具的 URL 处理逻辑 ([eab59d9](https://github.com/wuliya336/starlight-qsign/commit/eab59d95c56b55875c0f20410ac79a3f0a89f512))

### 🔄 持续集成

* 更新 ESLint 配置和目录结构 ([216bdd8](https://github.com/wuliya336/starlight-qsign/commit/216bdd8795ee31c3ce7521285c09853e72c1fcf4))
* 添加代码格式化和提交检查工作流 ([fb8d61b](https://github.com/wuliya336/starlight-qsign/commit/fb8d61beb851024089e0a23556e94b78678243ad))
* 修复 GitHub Actions 中的 PR 创建步骤 ([4a3cde7](https://github.com/wuliya336/starlight-qsign/commit/4a3cde75e5b929630132c8198f3cb1108da930ad))
* 优化版本更新流程和 PR 创建过程 ([024d03d](https://github.com/wuliya336/starlight-qsign/commit/024d03d05495d445f758f439dd39d1f608dfb686))
* 优化项目版本更新流程 ([9d7b472](https://github.com/wuliya336/starlight-qsign/commit/9d7b4721a4b4143734f140360eb134add1c91f9e))

# 2.5.0
- `优化`构造签名地址方法

# 2.4.0
- `修改部分BUG`

# 2.3.2
  - `本插件从此版本暂停更新,感谢使用`ⁿᵉʷ
  - 优化并修复`部分模块`功能

# 2.3.1
  - 优化`签名列表功能`模块，增加`并发`，提升速度
  - `细节优化`

# 2.3.0
  - 初步适配`Karin`框架ⁿᵉʷ

# 2.2.0
  - 优化`远程功能`模块，逐步使用集群模式，提升签名状态查询速度以及签名的参考性
  - 开始重写部分功能
  - 优化`签名状态检测`模块

# 2.1.0
  - `细节优化`

# 2.0.0
  - 优化`模块渲染`
  - 优化`部分模块`
  - 修复`获取数据更新时间`
  - 新增`#星点签名查询签名地址`
  - 细节优化
  - 优化输出

# 1.0.0
  - 修改发送方式为`转发消息`
  - 新增`帮助图渲染`
  - 修改获取列表信息为`云端`
  - 新增`版本信息`渲染
  - 优化处理`云端信息`
  - 新增`备注信息`
  - 优化`并发`
  - 新增`#星点签名设置`
  - 细节优化
  - 移除不必要的文件
  - 新增`公共签名API列表`
  - 优化`远程功能`
  - 新增`本地与远程切换`
  - 优化`信息输出`

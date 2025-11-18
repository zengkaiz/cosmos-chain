# 区块链项目集合

这个仓库包含了三个相关的区块链项目，涵盖了从教学到生产级的完整区块链技术栈。

## 📁 项目结构

```
chain/
├── mychain/          # Cosmos SDK 区块链 (使用 Ignite CLI 生成)
├── nodechain/        # Node.js 自研区块链 (教学项目)
├── chain-front/      # React 区块链浏览器 (可连接两条链)
├── INTEGRATION.md    # 集成指南
└── README.md         # 本文档
```

## 🚀 快速开始

### 1. NodeChain + 区块链浏览器 (推荐新手)

最简单的组合，适合学习区块链基础概念：

```bash
# 终端 1: 启动 NodeChain API 服务器
cd nodechain
npm install
npm run server
# 运行在 http://localhost:3000

# 终端 2: 启动前端浏览器
cd chain-front
npm install
npm run dev
# 访问 http://localhost:5173
```

在浏览器中输入 `http://localhost:3000` 并点击"连接"。

### 2. Cosmos 链 + 区块链浏览器 (生产级)

使用 Cosmos SDK 构建的完整区块链：

```bash
# 终端 1: 启动 Cosmos 链
cd mychain
ignite chain serve
# RPC 运行在 http://localhost:26657

# 终端 2: 启动前端浏览器
cd chain-front
# 修改 vite.config.ts 中的 target 为 http://localhost:26657
npm run dev
```

在浏览器中输入 `http://localhost:26657` 并点击"连接"。

---

## 📦 项目详细介绍

### 1️⃣ NodeChain - Node.js 区块链

**位置:** `nodechain/`

**技术栈:**
- Node.js + ES Modules
- Express.js (HTTP API)
- SHA-256 哈希算法
- 工作量证明 (Proof of Work)

**核心功能:**
- ✅ 完整的区块链数据结构
- ✅ 工作量证明挖矿 (可调难度)
- ✅ 交易系统 (转账、余额查询)
- ✅ 挖矿奖励机制
- ✅ 链验证和篡改检测
- ✅ HTTP API 服务器
- ✅ 兼容前端浏览器

**快速命令:**
```bash
npm run server   # 启动 API 服务器
npm start        # 运行演示程序
npm test         # 运行测试
```

**文档:**
- [README.md](nodechain/README.md) - 完整文档
- [API.md](nodechain/API.md) - API 接口文档

**适用场景:**
- 🎓 学习区块链基础原理
- 🧪 快速原型开发
- 🔧 自定义区块链逻辑
- 📚 教学演示

---

### 2️⃣ MyChain - Cosmos SDK 区块链

**位置:** `mychain/`

**技术栈:**
- Cosmos SDK
- Tendermint Core (BFT 共识)
- Go 语言
- gRPC + REST API

**核心功能:**
- ✅ 完整的 Cosmos SDK 功能
- ✅ Tendermint BFT 共识
- ✅ 模块化架构
- ✅ IBC 跨链协议支持
- ✅ 自定义模块开发
- ✅ 生产级区块链

**快速命令:**
```bash
ignite chain serve   # 启动开发链
ignite chain build   # 构建二进制
ignite scaffold      # 脚手架工具
```

**文档:**
- [readme.md](mychain/readme.md)
- [Ignite CLI 文档](https://docs.ignite.com)

**适用场景:**
- 🏢 生产级区块链应用
- 🌐 跨链通信 (IBC)
- 🔌 自定义模块开发
- 💼 企业级解决方案

---

### 3️⃣ Chain-Front - 区块链浏览器

**位置:** `chain-front/`

**技术栈:**
- React 18 + TypeScript
- Vite (构建工具)
- Ant Design (UI 组件)
- CosmJS (@cosmjs/tendermint-rpc)
- Day.js (时间处理)

**核心功能:**
- ✅ 实时显示链信息
- ✅ 查看区块列表
- ✅ 区块详情查看
- ✅ 交易数据展示
- ✅ 自动刷新数据
- ✅ 支持代理配置
- ✅ 兼容多种区块链后端

**快速命令:**
```bash
npm run dev      # 开发模式
npm run build    # 生产构建
```

**文档:**
- [README.md](chain-front/README.md)

**连接配置:**

在 `vite.config.ts` 中修改 proxy target：

```typescript
// 连接到 NodeChain
target: 'http://localhost:3000'

// 连接到 Cosmos 链
target: 'http://localhost:26657'
```

**适用场景:**
- 👀 可视化区块链数据
- 🔍 调试区块链应用
- 📊 监控链状态
- 🎨 UI/UX 展示

---

## 🔗 集成方式

前端浏览器可以无缝连接到两种区块链后端：

| 后端 | 端口 | 技术 | 共识 |
|------|------|------|------|
| NodeChain | 3000 | Node.js | PoW |
| Cosmos (mychain) | 26657 | Cosmos SDK | BFT |

详细集成指南请查看 [INTEGRATION.md](INTEGRATION.md)

---

## 📊 功能对比

| 功能 | NodeChain | Cosmos (mychain) |
|------|-----------|------------------|
| 编程语言 | JavaScript | Go |
| 共识算法 | PoW | Tendermint BFT |
| 挖矿 | ✅ 手动挖矿 | ❌ 自动出块 |
| 交易 | ✅ HTTP API | ✅ gRPC/REST |
| 跨链 | ❌ | ✅ IBC |
| 智能合约 | ❌ | ✅ CosmWasm |
| 生产就绪 | ❌ 教学项目 | ✅ 生产级 |
| 学习曲线 | 🟢 简单 | 🔴 复杂 |
| 自定义程度 | 🟢 完全可控 | 🟡 模块化 |

---

## 🎯 使用建议

### 新手学习路径：

1. **第一步**: 运行 NodeChain 演示
   ```bash
   cd nodechain && npm start
   ```
   理解区块链的基本概念：区块、哈希、工作量证明、交易

2. **第二步**: 启动 NodeChain API + 前端浏览器
   ```bash
   cd nodechain && npm run server
   cd chain-front && npm run dev
   ```
   通过可视化界面观察区块链运行

3. **第三步**: 阅读 NodeChain 源码
   - `src/block.js` - 区块结构和挖矿
   - `src/blockchain.js` - 区块链逻辑
   - `src/transaction.js` - 交易系统

4. **第四步**: 尝试 Cosmos 链
   ```bash
   cd mychain && ignite chain serve
   ```
   体验生产级区块链的功能

### 开发者路径：

1. **前端开发**: 使用 `chain-front` 作为模板
2. **后端开发**:
   - 简单项目 → 修改 NodeChain
   - 生产项目 → 使用 Cosmos SDK

---

## 🛠️ 开发工具

### NodeChain 开发
```bash
cd nodechain
npm run dev        # 开发模式 (自动重启)
npm test           # 运行测试
```

### Cosmos 链开发
```bash
cd mychain
ignite chain serve              # 开发链
ignite scaffold module mymod    # 创建模块
ignite scaffold message send    # 创建消息类型
```

### 前端开发
```bash
cd chain-front
npm run dev        # 开发服务器
npm run build      # 生产构建
```

---

## 📚 学习资源

### 区块链基础
- [比特币白皮书](https://bitcoin.org/bitcoin.pdf)
- [以太坊黄皮书](https://ethereum.github.io/yellowpaper/paper.pdf)
- [区块链技术指南](https://yeasy.gitbook.io/blockchain_guide/)

### Cosmos 生态
- [Cosmos SDK 文档](https://docs.cosmos.network)
- [Tendermint 文档](https://docs.tendermint.com)
- [Ignite CLI 文档](https://docs.ignite.com)
- [CosmJS 文档](https://cosmos.github.io/cosmjs/)

### 前端开发
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org)
- [Ant Design](https://ant.design)
- [Vite 文档](https://vitejs.dev)

---

## 🔧 故障排除

### NodeChain 无法启动
```bash
# 检查端口占用
lsof -i :3000
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### Cosmos 链启动失败
```bash
# 重置链数据
ignite chain serve --reset-once
```

### 前端连接失败
1. 检查 `vite.config.ts` 中的 proxy target
2. 确认后端服务正在运行
3. 检查浏览器控制台错误

### CORS 错误
- NodeChain: 已内置 CORS 支持
- Cosmos: 修改 `config/config.toml` 中的 `cors_allowed_origins`

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

MIT

---

## 🎉 总结

你现在拥有：
- 🎓 **教学级区块链** (NodeChain) - 理解原理
- 🏢 **生产级区块链** (Cosmos) - 实际应用
- 👀 **可视化工具** (浏览器) - 观察运行

从简单到复杂，从理论到实践，完整的区块链学习和开发环境已经搭建完成！

**开始你的区块链之旅吧！** 🚀

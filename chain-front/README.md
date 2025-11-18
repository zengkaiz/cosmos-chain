# Cosmos 区块链浏览器

一个基于 React + TypeScript 的区块链浏览器，用于查看 Cosmos 链的区块信息。

## 功能特性

- 实时显示链信息（链 ID、当前区块高度、最新区块时间）
- 查看最近 20 个区块列表
- 查看区块详细信息（区块哈希、时间、交易数、提议者地址等）
- 支持自定义 RPC 端点
- 实时刷新数据
- 内置代理解决 CORS 跨域问题

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design
- CosmJS (@cosmjs/stargate, @cosmjs/tendermint-rpc)
- Day.js

## 前置要求

- Node.js >= 16
- 一个正在运行的 Cosmos 链（默认连接 `http://localhost:26657`）

## 安装

```bash
npm install
```

## 运行

1. 确保你的 Cosmos 链正在运行
2. 启动开发服务器：

```bash
npm run dev
```

3. 打开浏览器访问 `http://localhost:5173`

## 使用说明

1. 在连接页面输入 RPC 端点（默认 `http://localhost:26657`）
2. 点击"连接"按钮
3. 连接成功后会自动显示链信息和最近的区块列表
4. 点击区块高度可以查看区块详情
5. 点击"刷新数据"按钮可以手动刷新数据

## 连接说明

浏览器前端通过 CosmJS 连接到 Cosmos 链的 RPC 端点。CosmJS 会自动将 HTTP URL（如 `http://localhost:26657`）转换为 WebSocket 连接（`ws://localhost:26657`）。

## 构建生产版本

```bash
npm run build
```

## 连接到你的 Cosmos 链

默认情况下，浏览器会连接到 `http://localhost:26657`。如果你的链运行在不同的端口或地址，可以在连接页面直接输入 RPC 端点地址。

### 确保你的链正在运行

```bash
# 在你的 Cosmos 链目录中启动链节点
mychaind start

# 或者如果你的链名称是其他名字，比如：
# chain-frontd start
```

## 项目结构

```
chain-front/
├── src/
│   ├── components/          # React 组件
│   │   ├── BlockList.tsx   # 区块列表组件
│   │   ├── BlockDetail.tsx # 区块详情组件
│   │   └── ChainStats.tsx  # 链统计信息组件
│   ├── services/           # 服务层
│   │   └── blockchain.ts   # 区块链连接服务
│   ├── App.tsx             # 主应用组件
│   └── main.tsx            # 应用入口
├── vite.config.ts          # Vite 配置（包含代理设置）
├── package.json
└── README.md
```

## 常见问题

### 连接失败
请确保：
1. Cosmos 链正在运行
2. RPC 端点地址正确（默认是 `http://localhost:26657`）
3. 链的 RPC 服务已启用

### CORS 错误
Cosmos SDK 的 RPC 端点默认允许跨域访问。如果遇到 CORS 问题，请检查链的配置文件 `config/config.toml` 中的 `cors_allowed_origins` 设置。

## License

MIT

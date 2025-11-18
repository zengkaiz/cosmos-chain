# 如何获取测试账户助记词

## 方法 1: 查看 ignite chain serve 启动日志

当你运行 `ignite chain serve` 时，在启动日志中会显示测试账户信息，类似：

```
🌍 Tendermint node: http://0.0.0.0:26657
🌍 Blockchain API: http://0.0.0.0:1317
🌍 Token faucet: http://0.0.0.0:4500

💰 Accounts

alice
  mnemonic: word1 word2 word3 ... word24
  address: cosmos1...

bob
  mnemonic: word1 word2 word3 ... word24
  address: cosmos1...
```

**重要：复制这些助记词到安全的地方！**

## 方法 2: 使用命令行查询

在 mychain 目录下：

```bash
# 列出所有账户
mychaind keys list

# 查看特定账户（如果有密钥环设置）
mychaind keys show alice
```

## 方法 3: 查看配置文件

有些 Cosmos SDK 链会将测试账户保存在配置目录：

```bash
# 检查 config 目录
cat ~/.mychain/config/accounts.json
# 或
cat config/accounts.json
```

## 使用助记词连接钱包

1. 启动前端浏览器: `cd chain-front && npm run dev`
2. 访问 http://localhost:5173
3. 点击"连接"连接到链
4. 在右侧"连接钱包"卡片中：
   - 将 24 个单词的助记词粘贴到文本框
   - 点击"连接钱包"
5. 连接成功后会显示地址和余额

## 测试转账

连接钱包后：

1. 在"发送代币"表单中：
   - 接收地址：填入另一个测试账户地址（如 bob 的地址）
   - 代币类型：选择 stake
   - 金额：输入数量（最小单位，如 1000000 = 1 stake）
   - 备注：可选

2. 点击"发送交易"

3. 等待几秒钟，页面会自动刷新区块列表

4. 在最新的区块中点击查看，可以找到你刚才发送的交易

## 生成新钱包（开发测试）

如果找不到助记词，也可以在前端直接生成新钱包：

1. 点击"生成新钱包"按钮
2. **务必保存显示的助记词！**
3. 点击"连接钱包"

**注意：新生成的钱包没有余额，需要通过水龙头或转账获取代币**

## 获取测试代币

如果钱包没有余额：

1. 使用 alice 或 bob 等预设账户（它们通常有初始余额）
2. 或者等待 ignite 的 faucet 服务（如果配置了的话）
3. 或者让另一个有余额的账户转账给你

## 常见问题

**Q: 连接钱包失败？**
- 确保 Cosmos 链正在运行 (`ignite chain serve`)
- 确保助记词格式正确（24个单词，空格分隔）
- 检查地址前缀是否为 `cosmos`

**Q: 转账失败？**
- 检查账户余额是否足够
- 确保接收地址格式正确
- 检查 gas 费用设置

**Q: 找不到交易？**
- 等待几秒让区块出块
- 点击"刷新数据"按钮
- 在最新的几个区块中查找

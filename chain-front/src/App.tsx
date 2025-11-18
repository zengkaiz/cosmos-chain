import { useState, useEffect } from 'react';
import { Layout, Typography, Button, message, Input, Space, Spin, Alert } from 'antd';
import { ReloadOutlined, ApiOutlined } from '@ant-design/icons';
import { ChainStats } from './components/ChainStats';
import { BlockList } from './components/BlockList';
import { BlockDetail } from './components/BlockDetail';
import { blockchainService } from './services/blockchain';
import type { BlockInfo, ChainInfo } from './services/blockchain';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [chainInfo, setChainInfo] = useState<ChainInfo | null>(null);
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BlockInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [rpcEndpoint, setRpcEndpoint] = useState('http://localhost:26657');
  const [detailVisible, setDetailVisible] = useState(false);

  const connectToChain = async () => {
    setLoading(true);
    try {
      // 始终使用 /rpc 代理路径，避免跨域
      // 用户输入的地址需要在 vite.config.ts 的 proxy.target 中配置
      blockchainService.setRpcEndpoint('/rpc');
      await blockchainService.connect();
      setConnected(true);
      message.success(`成功连接到区块链 (代理目标: ${rpcEndpoint})`);

      // 直接获取数据，不依赖 connected 状态
      await loadData();
    } catch (error) {
      message.error('连接失败，请检查 vite.config.ts 中的代理配置是否正确');
      console.error(error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    console.log('Fetching chain info...');
    const info = await blockchainService.getChainInfo();
    console.log('Chain info:', info);
    setChainInfo(info);

    console.log('Fetching recent blocks...');
    const recentBlocks = await blockchainService.getRecentBlocks(20);
    console.log('Recent blocks count:', recentBlocks.length);
    setBlocks(recentBlocks.reverse());

    message.success('数据刷新成功');
  };

  const fetchData = async () => {
    if (!connected) return;

    setLoading(true);
    try {
      console.log('Fetching chain info...');
      const info = await blockchainService.getChainInfo();
      console.log('Chain info:', info);
      setChainInfo(info);

      console.log('Fetching recent blocks...');
      const recentBlocks = await blockchainService.getRecentBlocks(20);
      console.log('Recent blocks count:', recentBlocks.length);
      setBlocks(recentBlocks.reverse());

      message.success('数据刷新成功');
    } catch (error) {
      message.error('获取数据失败: ' + (error instanceof Error ? error.message : '未知错误'));
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = async (height: number) => {
    try {
      const block = await blockchainService.getBlock(height);
      setSelectedBlock(block);
      setDetailVisible(true);
    } catch (error) {
      message.error('获取区块详情失败');
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      blockchainService.disconnect();
    };
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 50px' }}>
        <Title level={3} style={{ color: 'white', margin: '14px 0' }}>
          <ApiOutlined /> 区块链浏览器
        </Title>
      </Header>

      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {!connected ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Title level={4}>连接到你的 Cosmos 链</Title>
              <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 400, margin: '20px auto' }}>
                <Input
                  placeholder="RPC 端点地址"
                  value={rpcEndpoint}
                  onChange={(e) => setRpcEndpoint(e.target.value)}
                  size="large"
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={connectToChain}
                  loading={loading}
                  block
                >
                  连接
                </Button>
              </Space>
              <Alert
                message="配置说明"
                description={
                  <>
                    <p>输入框中填写的是目标链地址（如 http://localhost:26657）</p>
                    <p>需要在 vite.config.ts 的 proxy.target 中配置相同地址</p>
                    <p>实际请求会通过 /rpc 代理发送，避免跨域问题</p>
                  </>
                }
                type="info"
                showIcon
                style={{ maxWidth: 600, margin: '20px auto', textAlign: 'left' }}
              />
            </div>
          ) : (
            <Spin spinning={loading}>
              <div style={{ marginBottom: 20, textAlign: 'right' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchData}
                  loading={loading}
                >
                  刷新数据
                </Button>
              </div>

              <ChainStats chainInfo={chainInfo} loading={loading} />

              <BlockList
                blocks={blocks}
                loading={loading}
                onBlockClick={handleBlockClick}
              />

              <BlockDetail
                block={selectedBlock}
                visible={detailVisible}
                onClose={() => setDetailVisible(false)}
              />
            </Spin>
          )}
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Cosmos 区块链浏览器 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;

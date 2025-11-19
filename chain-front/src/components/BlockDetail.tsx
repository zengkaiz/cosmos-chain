import { Descriptions, Tag, Modal, Collapse, Typography, Space, Divider } from 'antd';
import { TransactionOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { BlockInfo } from '../services/blockchain';

const { Text, Paragraph } = Typography;

interface BlockDetailProps {
  block: BlockInfo | null;
  visible: boolean;
  onClose: () => void;
}

export const BlockDetail: React.FC<BlockDetailProps> = ({ block, visible, onClose }) => {
  if (!block) return null;

  return (
    <Modal
      title={`区块详情 #${block.height}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="区块高度">
          <strong>#{block.height}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="区块哈希">
          <code style={{ wordBreak: 'break-all' }}>{block.hash}</code>
        </Descriptions.Item>
        <Descriptions.Item label="时间">
          {dayjs(block.time).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="交易数量">
          <Tag color={block.txCount > 0 ? 'blue' : 'default'}>{block.txCount} 笔交易</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="提议者地址">
          <code style={{ wordBreak: 'break-all' }}>{block.proposer}</code>
        </Descriptions.Item>
      </Descriptions>

      {block.transactions && block.transactions.length > 0 && (
        <>
          <Divider orientation="left">
            <Space>
              <TransactionOutlined />
              <span>交易详情</span>
            </Space>
          </Divider>
          <Collapse
            size="small"
            items={block.transactions.map((tx) => ({
              key: tx.index,
              label: (
                <Space>
                  <Tag color="purple">TX #{tx.index}</Tag>
                  <Text code style={{ fontSize: 12 }}>
                    {tx.hash.substring(0, 16)}...
                  </Text>
                </Space>
              ),
              children: (
                <div>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>交易哈希:</Text>
                      <Paragraph
                        copyable
                        code
                        style={{ marginBottom: 8, marginTop: 4 }}
                      >
                        {tx.hash}
                      </Paragraph>
                    </div>
                    <div>
                      <Text strong>交易数据 (Base64):</Text>
                      <Paragraph
                        copyable
                        code
                        style={{
                          marginBottom: 0,
                          marginTop: 4,
                          maxHeight: 200,
                          overflow: 'auto',
                          fontSize: 11,
                        }}
                      >
                        {tx.data}
                      </Paragraph>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      💡 提示: 交易数据为 Base64 编码格式，可以复制后使用工具解码查看详情
                    </Text>
                  </Space>
                </div>
              ),
            }))}
          />
        </>
      )}

      {block.txCount === 0 && (
        <>
          <Divider />
          <Text type="secondary">此区块没有交易</Text>
        </>
      )}
    </Modal>
  );
};

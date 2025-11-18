import { Descriptions, Tag, Modal } from 'antd';
import dayjs from 'dayjs';
import type { BlockInfo } from '../services/blockchain';

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
      width={800}
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
    </Modal>
  );
};

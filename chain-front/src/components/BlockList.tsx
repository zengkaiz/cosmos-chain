import { Table, Card, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { BlockInfo } from '../services/blockchain';

interface BlockListProps {
  blocks: BlockInfo[];
  loading: boolean;
  onBlockClick?: (height: number) => void;
}

export const BlockList: React.FC<BlockListProps> = ({ blocks, loading, onBlockClick }) => {
  const columns: ColumnsType<BlockInfo> = [
    {
      title: '区块高度',
      dataIndex: 'height',
      key: 'height',
      render: (height: number) => (
        <a onClick={() => onBlockClick?.(height)} style={{ fontWeight: 'bold' }}>
          #{height}
        </a>
      ),
    },
    {
      title: '区块哈希',
      dataIndex: 'hash',
      key: 'hash',
      ellipsis: true,
      render: (hash: string) => (
        <code style={{ fontSize: '12px' }}>{hash.substring(0, 16)}...{hash.substring(hash.length - 8)}</code>
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '交易数',
      dataIndex: 'txCount',
      key: 'txCount',
      render: (count: number) => <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>,
    },
    {
      title: '提议者',
      dataIndex: 'proposer',
      key: 'proposer',
      ellipsis: true,
      render: (proposer: string) => (
        <code style={{ fontSize: '11px' }}>{proposer.substring(0, 12)}...</code>
      ),
    },
  ];

  return (
    <Card title="最新区块" style={{ marginTop: 20 }}>
      <Table
        columns={columns}
        dataSource={blocks}
        loading={loading}
        rowKey="height"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

import { Card, Statistic, Row, Col } from 'antd';
import { BlockOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ChainInfo } from '../services/blockchain';

interface ChainStatsProps {
  chainInfo: ChainInfo | null;
  loading: boolean;
}

export const ChainStats: React.FC<ChainStatsProps> = ({ chainInfo, loading }) => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            title="链 ID"
            value={chainInfo?.chainId || '-'}
            prefix={<LinkOutlined />}
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            title="当前区块高度"
            value={chainInfo?.latestBlockHeight || 0}
            prefix={<BlockOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card loading={loading}>
          <Statistic
            title="最新区块时间"
            value={chainInfo ? dayjs(chainInfo.latestBlockTime).format('HH:mm:ss') : '-'}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ fontSize: '18px' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

import React, { useMemo } from 'react'
import { Card, Row, Col, Statistic, Typography, Progress, Space, Tooltip, Select } from 'antd'
import { 

  InfoCircleOutlined 
} from '@ant-design/icons'
import type { Fund, FundDataPoint, TimeRange } from '@/types'

const { Title, Text } = Typography
const { Option } = Select

interface PerformanceMetricsProps {
  fund: Fund
  fundData: FundDataPoint[]
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  className?: string
}

interface PerformanceData {
  totalReturn: number
  annualizedReturn: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  beta: number
  winRate: number
  calmarRatio: number
}

const timeRangeOptions = [
  { label: '1月', value: '1M' as TimeRange },
  { label: '3月', value: '3M' as TimeRange },
  { label: '6月', value: '6M' as TimeRange },
  { label: '1年', value: '1Y' as TimeRange },
  { label: '全部', value: 'ALL' as TimeRange },
]

// Performance calculation functions
const calculatePerformanceMetrics = (data: FundDataPoint[]): PerformanceData => {
  if (data.length < 2) {
    return {
      totalReturn: 0,
      annualizedReturn: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      beta: 0,
      winRate: 0,
      calmarRatio: 0
    }
  }

  const prices = data.map(d => d.value)
  const returns = []
  
  // Calculate daily returns
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }

  // Total return
  const totalReturn = (prices[prices.length - 1] - prices[0]) / prices[0]

  // Annualized return
  const days = data.length
  const years = days / 365
  const annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1

  // Volatility (standard deviation of returns)
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length
  const volatility = Math.sqrt(variance) * Math.sqrt(252) // Annualized

  // Sharpe ratio (assuming risk-free rate of 3%)
  const riskFreeRate = 0.03
  const sharpeRatio = (annualizedReturn - riskFreeRate) / volatility

  // Maximum drawdown
  let maxDrawdown = 0
  let peak = prices[0]
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > peak) {
      peak = prices[i]
    }
    const drawdown = (peak - prices[i]) / peak
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  // Beta (correlation with market, simplified calculation)
  const beta = 1 + (Math.random() - 0.5) * 0.5 // Mock beta between 0.75 and 1.25

  // Win rate (percentage of positive returns)
  const positiveReturns = returns.filter(r => r > 0).length
  const winRate = positiveReturns / returns.length

  // Calmar ratio
  const calmarRatio = maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0

  return {
    totalReturn,
    annualizedReturn,
    volatility,
    sharpeRatio,
    maxDrawdown,
    beta,
    winRate,
    calmarRatio
  }
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  fund,
  fundData,
  timeRange,
  onTimeRangeChange,
  className = ''
}) => {
  const metrics = useMemo(() => {
    return calculatePerformanceMetrics(fundData)
  }, [fundData])

  const formatPercentage = (value: number, precision: number = 2) => {
    return `${(value * 100).toFixed(precision)}%`
  }

  const getReturnColor = (value: number) => {
    return value >= 0 ? '#52c41a' : '#ff4d4f'
  }

  const getRiskLevel = (volatility: number) => {
    if (volatility < 0.1) return { level: '低', color: '#52c41a' }
    if (volatility < 0.2) return { level: '中', color: '#faad14' }
    return { level: '高', color: '#ff4d4f' }
  }

  const getSharpeRating = (sharpe: number) => {
    if (sharpe > 1) return { rating: '优秀', color: '#52c41a' }
    if (sharpe > 0.5) return { rating: '良好', color: '#faad14' }
    if (sharpe > 0) return { rating: '一般', color: '#fa8c16' }
    return { rating: '较差', color: '#ff4d4f' }
  }

  return (
    <Card 
      className={`card ${className}`}
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="mb-0">性能指标</Title>
          <Space>
            <Text className="text-sm text-gray-500">统计周期:</Text>
            <Select
              value={timeRange}
              onChange={onTimeRangeChange}
              size="small"
              style={{ width: 80 }}
            >
              {timeRangeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Return Metrics */}
        <div>
          <Text className="text-sm text-gray-500 mb-3 block">收益指标</Text>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8}>
              <Statistic
                title="总收益率"
                value={metrics.totalReturn}
                precision={2}
                valueStyle={{ color: getReturnColor(metrics.totalReturn) }}
                formatter={(value) => formatPercentage(value as number)}
                prefix={metrics.totalReturn >= 0 ? <InfoCircleOutlined /> : <InfoCircleOutlined />}
              />
            </Col>
            <Col xs={12} sm={8}>
              <Statistic
                title="年化收益率"
                value={metrics.annualizedReturn}
                precision={2}
                valueStyle={{ color: getReturnColor(metrics.annualizedReturn) }}
                formatter={(value) => formatPercentage(value as number)}
                prefix={metrics.annualizedReturn >= 0 ? <InfoCircleOutlined /> : <InfoCircleOutlined />}
              />
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <div className="text-sm text-gray-500 mb-1">胜率</div>
                <div className="flex items-center space-x-2">
                  <Progress
                    percent={metrics.winRate * 100}
                    size="small"
                    strokeColor="#52c41a"
                    showInfo={false}
                    className="flex-1"
                  />
                  <Text className="text-sm font-medium">
                    {formatPercentage(metrics.winRate)}
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Risk Metrics */}
        <div>
          <Text className="text-sm text-gray-500 mb-3 block">风险指标</Text>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8}>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Text className="text-sm text-gray-500">波动率</Text>
                  <Tooltip title="衡量基金净值波动程度，数值越高风险越大">
                    <InfoCircleOutlined className="text-xs text-gray-400" />
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <Text className="text-lg font-medium">
                    {formatPercentage(metrics.volatility)}
                  </Text>
                  <Text 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: getRiskLevel(metrics.volatility).color + '20',
                      color: getRiskLevel(metrics.volatility).color 
                    }}
                  >
                    {getRiskLevel(metrics.volatility).level}风险
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Text className="text-sm text-gray-500">最大回撤</Text>
                  <Tooltip title="从最高点到最低点的最大跌幅">
                    <InfoCircleOutlined className="text-xs text-gray-400" />
                  </Tooltip>
                </div>
                <Text className="text-lg font-medium text-danger-500">
                  -{formatPercentage(metrics.maxDrawdown)}
                </Text>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Text className="text-sm text-gray-500">Beta系数</Text>
                  <Tooltip title="衡量基金相对于市场的敏感度，1表示与市场同步">
                    <InfoCircleOutlined className="text-xs text-gray-400" />
                  </Tooltip>
                </div>
                <Text className="text-lg font-medium">
                  {metrics.beta.toFixed(2)}
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Risk-Adjusted Metrics */}
        <div>
          <Text className="text-sm text-gray-500 mb-3 block">风险调整指标</Text>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8}>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Text className="text-sm text-gray-500">夏普比率</Text>
                  <Tooltip title="衡量每单位风险获得的超额收益，数值越高越好">
                    <InfoCircleOutlined className="text-xs text-gray-400" />
                  </Tooltip>
                </div>
                <div className="flex items-center space-x-2">
                  <Text className="text-lg font-medium">
                    {metrics.sharpeRatio.toFixed(2)}
                  </Text>
                  <Text 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: getSharpeRating(metrics.sharpeRatio).color + '20',
                      color: getSharpeRating(metrics.sharpeRatio).color 
                    }}
                  >
                    {getSharpeRating(metrics.sharpeRatio).rating}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  <Text className="text-sm text-gray-500">卡玛比率</Text>
                  <Tooltip title="年化收益率与最大回撤的比值，数值越高越好">
                    <InfoCircleOutlined className="text-xs text-gray-400" />
                  </Tooltip>
                </div>
                <Text className="text-lg font-medium">
                  {metrics.calmarRatio.toFixed(2)}
                </Text>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <div className="text-sm text-gray-500 mb-1">综合评分</div>
                <div className="flex items-center space-x-2">
                  <Progress
                    type="circle"
                    size={60}
                    percent={Math.max(0, Math.min(100, (metrics.sharpeRatio + 1) * 40))}
                    strokeColor={{
                      '0%': '#ff4d4f',
                      '50%': '#faad14',
                      '100%': '#52c41a',
                    }}
                    format={(percent) => `${Math.round(percent || 0)}`}
                  />
                  <div>
                    <div className="text-xs text-gray-500">基于风险调整收益</div>
                    <div className="text-xs text-gray-400">综合评估得分</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  )
}

export default PerformanceMetrics
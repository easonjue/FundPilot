import React, { useMemo, useState } from 'react'
import { Card, Space, Select, Switch, Typography, Tag, Tooltip, Row, Col } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  MinusOutlined,
  FilterOutlined 
} from '@ant-design/icons'
import type { Fund, FundDataPoint, TradingSignal } from '@/types'

const { Title, Text } = Typography
const { Option } = Select

interface TradingSignalsChartProps {
  fund: Fund
  fundData: FundDataPoint[]
  signals: TradingSignal[]
  onSignalClick?: (signal: TradingSignal) => void
  className?: string
}

interface SignalFilters {
  strategyTypes: string[]
  signalTypes: ('buy' | 'sell' | 'hold')[]
  minConfidence: number
  showAll: boolean
}

// Mock trading signals generation
const generateMockSignals = (fund: Fund, fundData: FundDataPoint[]): TradingSignal[] => {
  const signals: TradingSignal[] = []
  const strategies = ['均线交叉', 'RSI超买超卖', 'MACD金叉死叉', '布林带突破', '成交量异动']
  
  // Generate signals at random intervals
  for (let i = 20; i < fundData.length; i += Math.floor(Math.random() * 15) + 5) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]
    const signalType = Math.random() > 0.6 ? 'buy' : Math.random() > 0.3 ? 'sell' : 'hold'
    const confidence = 0.5 + Math.random() * 0.4 // 50% - 90%
    
    signals.push({
      id: `signal_${i}`,
      fundCode: fund.code,
      fundName: fund.name,
      date: fundData[i].date,
      strategyType: strategy,
      signalType,
      confidence,
      recommendation: signalType === 'buy' ? '建议买入' : signalType === 'sell' ? '建议卖出' : '建议持有',
      technicalReason: `基于${strategy}策略，置信度${Math.round(confidence * 100)}%`
    })
  }
  
  return signals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const TradingSignalsChart: React.FC<TradingSignalsChartProps> = ({
  fund,
  fundData,
  signals: propSignals,
  onSignalClick,
  className = ''
}) => {
  const [filters, setFilters] = useState<SignalFilters>({
    strategyTypes: [],
    signalTypes: [],
    minConfidence: 0,
    showAll: true
  })

  // Generate mock signals if none provided
  const allSignals = useMemo(() => {
    return propSignals.length > 0 ? propSignals : generateMockSignals(fund, fundData)
  }, [propSignals, fund, fundData])

  // Filter signals
  const filteredSignals = useMemo(() => {
    return allSignals.filter(signal => {
      if (!filters.showAll) {
        if (filters.strategyTypes.length > 0 && !filters.strategyTypes.includes(signal.strategyType)) {
          return false
        }
        if (filters.signalTypes.length > 0 && !filters.signalTypes.includes(signal.signalType)) {
          return false
        }
        if (signal.confidence < filters.minConfidence / 100) {
          return false
        }
      }
      return true
    })
  }, [allSignals, filters])

  // Get unique strategy types
  const strategyTypes = useMemo(() => {
    return Array.from(new Set(allSignals.map(s => s.strategyType)))
  }, [allSignals])

  const getSignalIcon = (signalType: 'buy' | 'sell' | 'hold') => {
    switch (signalType) {
      case 'buy':
        return <ArrowUpOutlined className="text-success-500" />
      case 'sell':
        return <ArrowDownOutlined className="text-danger-500" />
      default:
        return <MinusOutlined className="text-gray-400" />
    }
  }

  const getSignalColor = (signalType: 'buy' | 'sell' | 'hold') => {
    switch (signalType) {
      case 'buy':
        return '#52c41a'
      case 'sell':
        return '#ff4d4f'
      default:
        return '#d9d9d9'
    }
  }

  const chartOption: EChartsOption = useMemo(() => {
    if (!fundData.length) return {}

    const dates = fundData.map(d => d.date)
    const prices = fundData.map(d => d.value)

    // Create signal markers
    const signalMarkers = filteredSignals.map(signal => {
      const dateIndex = dates.findIndex(date => 
        new Date(date).toDateString() === new Date(signal.date).toDateString()
      )
      
      if (dateIndex === -1) return null

      return {
        name: signal.strategyType,
        coord: [dateIndex, prices[dateIndex]],
        value: signal.signalType,
        itemStyle: {
          color: getSignalColor(signal.signalType)
        },
        symbol: signal.signalType === 'buy' ? 'triangle' : signal.signalType === 'sell' ? 'diamond' : 'circle',
        symbolSize: 12,
        data: signal
      }
    }).filter(Boolean)

    return {
      title: {
        text: `${fund.name} 交易信号`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return ''
          
          let tooltip = ''
          params.forEach((param: any) => {
            if (param.componentType === 'series' && param.seriesType === 'line') {
              const date = new Date(dates[param.dataIndex]).toLocaleDateString('zh-CN')
              tooltip += `<div><strong>${date}</strong></div>`
              tooltip += `<div style="color: ${param.color}">净值: ${param.value.toFixed(4)}</div>`
            }
          })
          
          return tooltip
        }
      },
      legend: {
        data: ['净值', '买入信号', '卖出信号', '持有信号'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          formatter: (value: string) => {
            return new Date(value).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric'
            })
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}' },
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } }
      },
      series: [
        {
          name: '净值',
          type: 'line',
          data: prices,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: '#2D6DF6' },
          markPoint: {
            data: signalMarkers,
            tooltip: {
              formatter: (params: any) => {
                const signal = params.data.data as TradingSignal
                return `
                  <div><strong>${signal.strategyType}</strong></div>
                  <div>信号: ${signal.recommendation}</div>
                  <div>置信度: ${Math.round(signal.confidence * 100)}%</div>
                  <div>时间: ${new Date(signal.date).toLocaleDateString('zh-CN')}</div>
                  <div>原因: ${signal.technicalReason}</div>
                `
              }
            }
          }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          start: 70,
          end: 100
        },
        {
          start: 70,
          end: 100,
          height: 30,
          bottom: 20
        }
      ]
    }
  }, [fundData, fund, filteredSignals])

  const handleFilterChange = (key: keyof SignalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card 
      className={`card ${className}`}
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="mb-0">交易信号分析</Title>
          <Space>
            <FilterOutlined />
            <Text className="text-sm text-gray-500">
              {filteredSignals.length} / {allSignals.length} 个信号
            </Text>
          </Space>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text className="text-sm text-gray-500 mb-1 block">显示所有信号</Text>
                <Switch
                  checked={filters.showAll}
                  onChange={(checked) => handleFilterChange('showAll', checked)}
                />
              </div>
            </Col>
            
            {!filters.showAll && (
              <>
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text className="text-sm text-gray-500 mb-1 block">策略类型</Text>
                    <Select
                      mode="multiple"
                      placeholder="选择策略"
                      value={filters.strategyTypes}
                      onChange={(value) => handleFilterChange('strategyTypes', value)}
                      style={{ width: '100%' }}
                      size="small"
                    >
                      {strategyTypes.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text className="text-sm text-gray-500 mb-1 block">信号类型</Text>
                    <Select
                      mode="multiple"
                      placeholder="选择信号"
                      value={filters.signalTypes}
                      onChange={(value) => handleFilterChange('signalTypes', value)}
                      style={{ width: '100%' }}
                      size="small"
                    >
                      <Option value="buy">买入</Option>
                      <Option value="sell">卖出</Option>
                      <Option value="hold">持有</Option>
                    </Select>
                  </div>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <div>
                    <Text className="text-sm text-gray-500 mb-1 block">最低置信度</Text>
                    <Select
                      value={filters.minConfidence}
                      onChange={(value) => handleFilterChange('minConfidence', value)}
                      style={{ width: '100%' }}
                      size="small"
                    >
                      <Option value={0}>不限</Option>
                      <Option value={50}>50%</Option>
                      <Option value={60}>60%</Option>
                      <Option value={70}>70%</Option>
                      <Option value={80}>80%</Option>
                    </Select>
                  </div>
                </Col>
              </>
            )}
          </Row>
        </div>

        {/* Chart */}
        <div style={{ height: 400 }}>
          <ReactECharts
            option={chartOption}
            style={{ height: '100%', width: '100%' }}
            onEvents={{
              click: (params: any) => {
                if (params.componentType === 'markPoint' && params.data?.data) {
                  onSignalClick?.(params.data.data)
                }
              }
            }}
          />
        </div>

        {/* Signal Legend */}
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span>买入信号</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
            <span>卖出信号</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span>持有信号</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TradingSignalsChart
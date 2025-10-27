import { Card, Space, Switch, Select, Typography, Divider, Row, Col } from 'antd'
import type { EChartsOption } from 'echarts'
import ReactECharts from 'echarts-for-react'
import React, { useMemo, useState } from 'react'
import type { Fund, FundDataPoint, TechnicalIndicator, TimeRange } from '@/types'

const { Title, Text } = Typography
const { Option } = Select

interface TechnicalIndicatorsChartProps {
  fund: Fund
  fundData: FundDataPoint[]
  indicators: TechnicalIndicator[]
  timeRange: TimeRange
  onTimeRangeChange: (range: TimeRange) => void
  onIndicatorToggle: (indicator: 'MA' | 'RSI' | 'MACD', enabled: boolean) => void
  loading?: boolean
  className?: string
}

interface IndicatorConfig {
  MA: boolean
  RSI: boolean
  MACD: boolean
}

const timeRangeOptions = [
  { label: '1月', value: '1M' as TimeRange },
  { label: '3月', value: '3M' as TimeRange },
  { label: '6月', value: '6M' as TimeRange },
  { label: '1年', value: '1Y' as TimeRange },
  { label: '全部', value: 'ALL' as TimeRange },
]

// Mock technical indicators calculation
const calculateMA = (data: FundDataPoint[], period: number = 20): number[] => {
  const ma: number[] = []
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ma.push(NaN)
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, point) => acc + point.value, 0)
      ma.push(sum / period)
    }
  }
  return ma
}

const calculateRSI = (data: FundDataPoint[], period: number = 14): number[] => {
  const rsi: number[] = []
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 1; i < data.length; i++) {
    const change = data[i].value - data[i - 1].value
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? -change : 0)
  }

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      rsi.push(NaN)
    } else {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period
      const rs = avgGain / (avgLoss || 1)
      rsi.push(100 - 100 / (1 + rs))
    }
  }

  return rsi
}

const calculateMACD = (
  data: FundDataPoint[]
): { macd: number[]; signal: number[]; histogram: number[] } => {
  const ema12 = calculateEMA(
    data.map(d => d.value),
    12
  )
  const ema26 = calculateEMA(
    data.map(d => d.value),
    26
  )
  const macd = ema12.map((val, i) => val - ema26[i])
  const signal = calculateEMA(macd, 9)
  const histogram = macd.map((val, i) => val - signal[i])

  return { macd, signal, histogram }
}

const calculateEMA = (data: number[], period: number): number[] => {
  const ema: number[] = []
  const multiplier = 2 / (period + 1)

  ema[0] = data[0]
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * multiplier + ema[i - 1] * (1 - multiplier)
  }

  return ema
}

const TechnicalIndicatorsChart: React.FC<TechnicalIndicatorsChartProps> = ({
  fund,
  fundData,
  timeRange,
  onTimeRangeChange,
  onIndicatorToggle,
  loading = false,
  className = '',
}) => {
  const [enabledIndicators, setEnabledIndicators] = useState<IndicatorConfig>({
    MA: true,
    RSI: true,
    MACD: true,
  })

  const handleIndicatorToggle = (indicator: keyof IndicatorConfig, enabled: boolean) => {
    setEnabledIndicators(prev => ({ ...prev, [indicator]: enabled }))
    onIndicatorToggle(indicator, enabled)
  }

  const chartOptions: EChartsOption = useMemo(() => {
    if (!fundData.length) return {}

    const dates = fundData.map(d => d.date)
    const prices = fundData.map(d => d.value)

    // Calculate indicators
    const ma20 = calculateMA(fundData, 20)
    const ma60 = calculateMA(fundData, 60)
    const rsi = calculateRSI(fundData)
    const { macd, signal, histogram } = calculateMACD(fundData)

    const series: any[] = [
      // Price line
      {
        name: '净值',
        type: 'line',
        data: prices,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color: '#2D6DF6' },
        yAxisIndex: 0,
      },
    ]

    // Add MA indicators
    if (enabledIndicators.MA) {
      series.push(
        {
          name: 'MA20',
          type: 'line',
          data: ma20,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1, color: '#FF6B35', type: 'dashed' },
          yAxisIndex: 0,
        },
        {
          name: 'MA60',
          type: 'line',
          data: ma60,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1, color: '#4ECDC4', type: 'dashed' },
          yAxisIndex: 0,
        }
      )
    }

    // Add RSI indicator
    if (enabledIndicators.RSI) {
      series.push({
        name: 'RSI',
        type: 'line',
        data: rsi,
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 1, color: '#9B59B6' },
        yAxisIndex: 1,
      })
    }

    // Add MACD indicators
    if (enabledIndicators.MACD) {
      series.push(
        {
          name: 'MACD',
          type: 'line',
          data: macd,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1, color: '#E74C3C' },
          yAxisIndex: 2,
        },
        {
          name: 'Signal',
          type: 'line',
          data: signal,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 1, color: '#F39C12' },
          yAxisIndex: 2,
        },
        {
          name: 'Histogram',
          type: 'bar',
          data: histogram,
          itemStyle: {
            color: (params: any) => (params.value >= 0 ? '#27AE60' : '#E74C3C'),
            opacity: 0.6,
          },
          yAxisIndex: 2,
        }
      )
    }

    const yAxes: any[] = [
      // Price axis
      {
        type: 'value',
        name: '净值',
        position: 'left',
        axisLabel: { formatter: '{value}' },
        splitLine: { show: true, lineStyle: { type: 'dashed', opacity: 0.3 } },
      },
    ]

    // RSI axis
    if (enabledIndicators.RSI) {
      yAxes.push({
        type: 'value',
        name: 'RSI',
        position: 'right',
        min: 0,
        max: 100,
        axisLabel: { formatter: '{value}' },
        splitLine: { show: false },
        axisLine: { show: true },
        offset: 0,
      })
    }

    // MACD axis
    if (enabledIndicators.MACD) {
      yAxes.push({
        type: 'value',
        name: 'MACD',
        position: 'right',
        axisLabel: { formatter: '{value}' },
        splitLine: { show: false },
        axisLine: { show: true },
        offset: enabledIndicators.RSI ? 60 : 0,
      })
    }

    return {
      title: {
        text: `${fund.name} 技术分析`,
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return ''

          const date = new Date(dates[params[0].dataIndex]).toLocaleDateString('zh-CN')
          let tooltip = `<div><strong>${date}</strong></div>`

          params.forEach((param: any) => {
            if (!isNaN(param.value)) {
              tooltip += `<div style="color: ${param.color}">
                ${param.seriesName}: ${typeof param.value === 'number' ? param.value.toFixed(4) : param.value}
              </div>`
            }
          })

          return tooltip
        },
      },
      legend: {
        data: series.map(s => s.name),
        top: 30,
        type: 'scroll',
      },
      grid: {
        left: '10%',
        right:
          enabledIndicators.RSI && enabledIndicators.MACD
            ? '15%'
            : enabledIndicators.RSI || enabledIndicators.MACD
              ? '10%'
              : '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          formatter: (value: string) => {
            return new Date(value).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            })
          },
        },
      },
      yAxis: yAxes,
      series,
      dataZoom: [
        {
          type: 'inside',
          start: 70,
          end: 100,
        },
        {
          start: 70,
          end: 100,
          height: 30,
          bottom: 20,
        },
      ],
    }
  }, [fundData, fund, enabledIndicators])

  return (
    <Card
      className={`card ${className}`}
      title={
        <div className="flex items-center justify-between">
          <Title level={4} className="mb-0">
            技术指标分析
          </Title>
          <Space>
            <Text className="text-sm text-gray-500">时间范围:</Text>
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
      <div className="space-y-4">
        {/* Indicator Controls */}
        <div>
          <Text className="text-sm text-gray-500 mb-2 block">技术指标</Text>
          <Row gutter={[16, 8]}>
            <Col>
              <Space>
                <Switch
                  size="small"
                  checked={enabledIndicators.MA}
                  onChange={checked => handleIndicatorToggle('MA', checked)}
                />
                <Text className="text-sm">移动平均线 (MA)</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <Switch
                  size="small"
                  checked={enabledIndicators.RSI}
                  onChange={checked => handleIndicatorToggle('RSI', checked)}
                />
                <Text className="text-sm">相对强弱指数 (RSI)</Text>
              </Space>
            </Col>
            <Col>
              <Space>
                <Switch
                  size="small"
                  checked={enabledIndicators.MACD}
                  onChange={checked => handleIndicatorToggle('MACD', checked)}
                />
                <Text className="text-sm">MACD</Text>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider className="my-4" />

        {/* Chart */}
        <div style={{ height: 500 }}>
          <ReactECharts
            option={chartOptions}
            style={{ height: '100%', width: '100%' }}
            showLoading={loading}
            loadingOption={{
              text: '加载中...',
              color: '#2D6DF6',
              textColor: '#666',
              maskColor: 'rgba(255, 255, 255, 0.8)',
              zlevel: 0,
            }}
          />
        </div>
      </div>
    </Card>
  )
}

export default TechnicalIndicatorsChart

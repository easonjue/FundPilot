import React, { useMemo } from 'react'
import { Card, Select, Space, Button, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import type { Fund, FundDataPoint, TimeRange } from '@/types'

const { Title, Text } = Typography
const { Option } = Select

interface FundPerformanceChartProps {
  funds: Fund[]
  selectedFunds: string[]
  fundData: Record<string, FundDataPoint[]>
  timeRange: TimeRange
  loading?: boolean
  onFundSelectionChange: (fundCodes: string[]) => void
  onTimeRangeChange: (range: TimeRange) => void
  className?: string
}

const timeRangeOptions = [
  { label: '1天', value: '1D' as TimeRange },
  { label: '1周', value: '1W' as TimeRange },
  { label: '1月', value: '1M' as TimeRange },
  { label: '3月', value: '3M' as TimeRange },
  { label: '6月', value: '6M' as TimeRange },
  { label: '1年', value: '1Y' as TimeRange },
  { label: '全部', value: 'ALL' as TimeRange },
]

const colors = [
  '#2D6DF6', // Primary blue
  '#13C2C2', // Success teal
  '#FF4D4F', // Danger red
  '#722ED1', // Purple
  '#FA8C16', // Orange
  '#52C41A', // Green
  '#1890FF', // Light blue
  '#EB2F96', // Pink
]

const FundPerformanceChart: React.FC<FundPerformanceChartProps> = ({
  funds,
  selectedFunds,
  fundData,
  timeRange,
  loading = false,
  onFundSelectionChange,
  onTimeRangeChange,
  className = ''
}) => {
  const chartOption: EChartsOption = useMemo(() => {
    const series = selectedFunds.map((fundCode, index) => {
      const fund = funds.find(f => f.code === fundCode)
      const data = fundData[fundCode] || []
      
      return {
        name: fund?.name || fundCode,
        type: 'line',
        data: data.map(point => [point.date, point.value]),
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color: colors[index % colors.length]
        },
        itemStyle: {
          color: colors[index % colors.length]
        }
      }
    })

    return {
      title: {
        text: '基金走势对比',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: (params: any) => {
          if (!Array.isArray(params)) return ''
          
          const date = new Date(params[0].value[0]).toLocaleDateString('zh-CN')
          let tooltip = `<div><strong>${date}</strong></div>`
          
          params.forEach((param: any) => {
            const value = param.value[1].toFixed(4)
            tooltip += `<div style="color: ${param.color}">
              ${param.seriesName}: ${value}
            </div>`
          })
          
          return tooltip
        }
      },
      legend: {
        data: selectedFunds.map(fundCode => {
          const fund = funds.find(f => f.code === fundCode)
          return fund?.name || fundCode
        }),
        top: 30,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          formatter: (value: number) => {
            return new Date(value).toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric'
            })
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        },
        axisLabel: {
          formatter: (value: number) => value.toFixed(4)
        }
      },
      series,
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          height: 30,
          bottom: 10
        }
      ]
    }
  }, [selectedFunds, funds, fundData])

  const fundOptions = funds.map(fund => ({
    label: `${fund.name} (${fund.code})`,
    value: fund.code
  }))

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <Title level={4} className="mb-0 text-gray-900 dark:text-gray-100">
              基金走势对比
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              多基金净值走势对比分析
            </Text>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Text className="text-sm text-gray-500 whitespace-nowrap">时间范围:</Text>
              <Select
                value={timeRange}
                onChange={onTimeRangeChange}
                size="middle"
                style={{ width: 100 }}
                className="shadow-sm"
              >
                {timeRangeOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <Select
              mode="multiple"
              placeholder="选择基金进行对比"
              value={selectedFunds}
              onChange={onFundSelectionChange}
              style={{ minWidth: 240 }}
              maxTagCount={2}
              options={fundOptions}
              className="shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: 450 }}>
          <ReactECharts
            option={chartOption}
            style={{ height: '100%', width: '100%' }}
            showLoading={loading}
            loadingOption={{
              text: '加载中...',
              color: '#2D6DF6',
              textColor: '#666',
              maskColor: 'rgba(255, 255, 255, 0.8)',
              zlevel: 0
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default FundPerformanceChart
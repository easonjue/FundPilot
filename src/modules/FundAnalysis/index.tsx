import React, { useState, useEffect } from 'react'
import { Row, Col, Typography } from 'antd'
import { FundOutlined } from '@ant-design/icons'
import FundSelectionPanel from '@/components/FundSelectionPanel'
import TechnicalIndicatorsChart from '@/components/TechnicalIndicatorsChart'
import TradingSignalsChart from '@/components/TradingSignalsChart'
import PerformanceMetrics from '@/components/PerformanceMetrics'
import { useSettingsStore } from '@/stores'
import type { Fund, FundDataPoint, TimeRange, TradingSignal } from '@/types'

const { Title, Text } = Typography

// Mock funds data (same as Dashboard)
const mockFunds: Fund[] = [
  {
    code: '001938',
    name: '易方达消费精选',
    type: 'mixed',
    currentValue: 2.1234,
    dailyChange: 0.0123,
    dailyChangePercent: 0.58,
    lastUpdate: new Date()
  },
  {
    code: '320007',
    name: '华夏科技成长',
    type: 'stock',
    currentValue: 1.8765,
    dailyChange: -0.0087,
    dailyChangePercent: -0.46,
    lastUpdate: new Date()
  },
  {
    code: '161725',
    name: '招商中证白酒',
    type: 'index',
    currentValue: 0.9876,
    dailyChange: 0.0034,
    dailyChangePercent: 0.35,
    lastUpdate: new Date()
  },
  {
    code: '110022',
    name: '易方达消费行业',
    type: 'stock',
    currentValue: 3.2145,
    dailyChange: 0.0234,
    dailyChangePercent: 0.73,
    lastUpdate: new Date()
  },
  {
    code: '000001',
    name: '华夏成长',
    type: 'mixed',
    currentValue: 1.5432,
    dailyChange: -0.0012,
    dailyChangePercent: -0.08,
    lastUpdate: new Date()
  },
  {
    code: '519066',
    name: '汇添富蓝筹稳健',
    type: 'mixed',
    currentValue: 2.8765,
    dailyChange: 0.0156,
    dailyChangePercent: 0.54,
    lastUpdate: new Date()
  }
]

// Generate mock historical data for analysis
const generateAnalysisFundData = (fundCode: string, days: number = 90): FundDataPoint[] => {
  const data: FundDataPoint[] = []
  const baseValue = Math.random() * 2 + 1 // Random base value between 1-3
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // More complex price movement simulation
    const trend = Math.sin(i * 0.02) * 0.3 // Long-term trend
    const noise = (Math.random() - 0.5) * 0.1 // Random noise
    const momentum = Math.sin(i * 0.1) * 0.15 // Medium-term momentum
    
    const value = baseValue + trend + noise + momentum
    
    data.push({
      date,
      value: Math.max(0.1, value), // Ensure positive value
      volume: Math.floor(Math.random() * 1000000)
    })
  }
  
  return data
}

const FundAnalysis: React.FC = () => {
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('3M')
  const [fundData, setFundData] = useState<FundDataPoint[]>([])
  const { watchlist, addToWatchlist, removeFromWatchlist } = useSettingsStore()

  // Generate fund data when selected fund or time range changes
  useEffect(() => {
    if (selectedFund) {
      const days = timeRange === '1M' ? 30 : timeRange === '3M' ? 90 : 
                   timeRange === '6M' ? 180 : timeRange === '1Y' ? 365 : 
                   timeRange === 'ALL' ? 730 : 90
      
      const data = generateAnalysisFundData(selectedFund.code, days)
      setFundData(data)
    }
  }, [selectedFund, timeRange])

  const handleFundSelect = (fund: Fund) => {
    setSelectedFund(fund)
  }

  const handleAddToWatchlist = (fundCode: string) => {
    addToWatchlist(fundCode)
  }

  const handleRemoveFromWatchlist = (fundCode: string) => {
    removeFromWatchlist(fundCode)
  }

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
  }

  const handleIndicatorToggle = (indicator: 'MA' | 'RSI' | 'MACD', enabled: boolean) => {
    console.log(`Indicator ${indicator} ${enabled ? 'enabled' : 'disabled'}`)
    // TODO: Store indicator preferences in settings
  }

  const handleSignalClick = (signal: TradingSignal) => {
    console.log('Signal clicked:', signal)
    // TODO: Show signal details modal or navigate to signal details
  }

  return (
    <div className="px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Title level={2} className="mb-0 text-gray-900 dark:text-gray-100">
          基金深度分析
        </Title>
        <Text className="text-gray-500 dark:text-gray-400">
          专业的技术分析工具，助您做出明智的投资决策
        </Text>
      </div>

      {/* Fund Selection */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
        <FundSelectionPanel
          allFunds={mockFunds}
          selectedFund={selectedFund}
          watchlist={watchlist}
          onFundSelect={handleFundSelect}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
        />
      </div>

      {selectedFund ? (
        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <PerformanceMetrics
              fund={selectedFund}
              fundData={fundData}
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
            />
          </div>

          {/* Technical Indicators Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <TechnicalIndicatorsChart
              fund={selectedFund}
              fundData={fundData}
              indicators={[]} // TODO: Add real indicators
              timeRange={timeRange}
              onTimeRangeChange={handleTimeRangeChange}
              onIndicatorToggle={handleIndicatorToggle}
            />
          </div>
          
          {/* Trading Signals Chart */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <TradingSignalsChart
              fund={selectedFund}
              fundData={fundData}
              signals={[]} // Will use mock signals
              onSignalClick={handleSignalClick}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 flex items-center justify-center py-20">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FundOutlined className="text-5xl text-white" />
            </div>
            <div>
              <Title level={3} className="text-gray-700 dark:text-gray-300 mb-2">
                选择基金开始分析
              </Title>
              <Text className="text-gray-500 dark:text-gray-400 text-base">
                从上方搜索或选择一个基金进行深度技术分析
              </Text>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundAnalysis
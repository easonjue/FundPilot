import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import React from 'react'
import type { MarketIndex } from '@/types'

const { Text } = Typography

interface MarketIndexCardProps {
  index: MarketIndex
  onClick?: () => void
  className?: string
}

const MarketIndexCard: React.FC<MarketIndexCardProps> = ({ index, onClick, className = '' }) => {
  const getTrendIcon = () => {
    switch (index.trend) {
      case 'up':
        return <ArrowUpOutlined className="text-success-500" />
      case 'down':
        return <ArrowDownOutlined className="text-danger-500" />
      default:
        return <MinusOutlined className="text-gray-400" />
    }
  }

  const _getTrendColor = () => {
    switch (index.trend) {
      case 'up':
        return 'text-success-500'
      case 'down':
        return 'text-danger-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}`
  }

  const formatChangePercent = (changePercent: number) => {
    const sign = changePercent >= 0 ? '+' : ''
    return `${sign}${changePercent.toFixed(2)}%`
  }

  return (
    <div
      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
      onClick={onClick}
    >
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
              {index.name}
            </Text>
            <div className="text-base">{getTrendIcon()}</div>
          </div>

          <div className="space-y-2">
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {index.value.toLocaleString('zh-CN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                index.trend === 'up'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : index.trend === 'down'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <span className="mr-1">{formatChange(index.change)}</span>
              <span>{formatChangePercent(index.changePercent)}</span>
            </div>
          </div>

          <Text className="text-xs text-gray-400 dark:text-gray-500 font-mono">{index.code}</Text>
        </div>
      </div>
    </div>
  )
}

export default MarketIndexCard

import React from 'react'
import { Card, Typography, Space, Button, Empty, Skeleton } from 'antd'
import { ReloadOutlined, RobotOutlined } from '@ant-design/icons'
import AIRecommendationCard from './AIRecommendationCard'
import ErrorDisplay from './ErrorDisplay'
import type { AIPrediction } from '@/types'

const { Title, Text } = Typography

interface AIRecommendationsPanelProps {
  predictions: Array<AIPrediction & { fundName: string }>
  loading?: boolean
  error?: any
  onRefresh?: () => void
  onActionClick?: (fundCode: string, action: 'buy' | 'sell' | 'hold') => void
  className?: string
}

const AIRecommendationsPanel: React.FC<AIRecommendationsPanelProps> = ({
  predictions,
  loading = false,
  error,
  onRefresh,
  onActionClick,
  className = ''
}) => {
  const handleActionClick = (fundCode: string, action: 'buy' | 'sell' | 'hold') => {
    onActionClick?.(fundCode, action)
  }

  const renderContent = () => {
    if (error) {
      return (
        <ErrorDisplay 
          error={error} 
          onRetry={onRefresh}
          size="small"
        />
      )
    }

    if (loading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(key => (
            <Skeleton key={key} active paragraph={{ rows: 2 }} />
          ))}
        </div>
      )
    }

    if (!predictions || predictions.length === 0) {
      return (
        <Empty
          image={<RobotOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
          description={
            <div>
              <Text className="text-gray-500">暂无AI推荐</Text>
              <br />
              <Text className="text-xs text-gray-400">
                系统正在分析市场数据，请稍后查看
              </Text>
            </div>
          }
        />
      )
    }

    return (
      <div className="space-y-4">
        {predictions.map((prediction) => (
          <AIRecommendationCard
            key={prediction.fundCode}
            prediction={prediction}
            fundName={prediction.fundName}
            onActionClick={(action) => handleActionClick(prediction.fundCode, action)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <RobotOutlined className="text-white text-lg" />
            </div>
            <div>
              <Title level={4} className="mb-0 text-gray-900 dark:text-gray-100">
                AI智能建议
              </Title>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                基于大数据分析的投资建议
              </Text>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {predictions.length > 0 && (
              <Text className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {predictions.length} 条建议
              </Text>
            )}
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  )
}

export default AIRecommendationsPanel
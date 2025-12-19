import { ExpandAltOutlined, MinusOutlined } from '@ant-design/icons'
import { Button, Progress, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import type { AIPrediction } from '@/types'

const { Text, Paragraph } = Typography

interface AIRecommendationCardProps {
  prediction: AIPrediction
  fundName: string
  className?: string
  onActionClick?: (action: 'buy' | 'sell' | 'hold') => void
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({
  prediction,
  fundName,
  className = '',
  onActionClick,
}) => {
  const [expanded, setExpanded] = useState(false)

  const getSuggestionConfig = () => {
    switch (prediction.suggestion) {
      case 'buy':
        return {
          color: 'success',
          bgColor: 'bg-success-50 dark:bg-success-900/20',
          textColor: 'text-success-700 dark:text-success-300',
          icon: <MinusOutlined />,
          label: '买入',
          description: '建议增加持仓',
        }
      case 'sell':
        return {
          color: 'error',
          bgColor: 'bg-danger-50 dark:bg-danger-900/20',
          textColor: 'text-danger-700 dark:text-danger-300',
          icon: <MinusOutlined />,
          label: '卖出',
          description: '建议减少持仓',
        }
      default:
        return {
          color: 'default',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          textColor: 'text-gray-700 dark:text-gray-300',
          icon: <MinusOutlined />,
          label: '持有',
          description: '建议维持现状',
        }
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success'
    if (confidence >= 0.6) return 'warning'
    return 'error'
  }

  const getDirectionTag = () => {
    switch (prediction.direction) {
      case 'up':
        return <Tag color="green">看涨</Tag>
      case 'down':
        return <Tag color="red">看跌</Tag>
      default:
        return <Tag color="default">中性</Tag>
    }
  }

  const config = getSuggestionConfig()
  const confidencePercent = Math.round(prediction.confidence * 100)

  return (
    <div
      className={`p-4 ${config.bgColor} rounded-xl border border-opacity-20 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                prediction.suggestion === 'buy'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : prediction.suggestion === 'sell'
                    ? 'bg-red-100 dark:bg-red-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <span className={config.textColor}>{config.icon}</span>
            </div>
            <div>
              <Text className={`font-semibold ${config.textColor} text-base`}>{fundName}</Text>
              <div className="text-xs text-gray-500 dark:text-gray-400">{prediction.fundCode}</div>
            </div>
          </div>
          <Button
            type="text"
            size="small"
            icon={<ExpandAltOutlined />}
            onClick={() => setExpanded(!expanded)}
            className="hover:bg-white/50 dark:hover:bg-gray-700/50"
          />
        </div>

        {/* Main recommendation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                prediction.suggestion === 'buy'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : prediction.suggestion === 'sell'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {config.label}
            </div>
            {getDirectionTag()}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">置信度</div>
            <Text className={`text-lg font-bold ${config.textColor}`}>{confidencePercent}%</Text>
          </div>
        </div>

        {/* Confidence progress */}
        <div className="space-y-2">
          <Progress
            percent={confidencePercent}
            size="small"
            status={
              getConfidenceColor(prediction.confidence) as
                | 'success'
                | 'exception'
                | 'normal'
                | 'active'
            }
            showInfo={false}
            strokeWidth={6}
            trailColor="rgba(0,0,0,0.06)"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>风险评估</span>
            <span>
              {confidencePercent >= 80 ? '低风险' : confidencePercent >= 60 ? '中风险' : '高风险'}
            </span>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <Text className="text-sm text-gray-600 dark:text-gray-400">预测方向：</Text>
              {getDirectionTag()}
            </div>

            <div>
              <Text className="text-sm text-gray-600 dark:text-gray-400">分析原因：</Text>
              <Paragraph className="text-sm mt-1 mb-0">{prediction.reason}</Paragraph>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>有效期至: {new Date(prediction.validUntil).toLocaleDateString('zh-CN')}</span>
              <span>基金代码: {prediction.fundCode}</span>
            </div>

            {onActionClick && (
              <div className="flex space-x-2 pt-2">
                <Button
                  size="small"
                  type={prediction.suggestion === 'buy' ? 'primary' : 'default'}
                  onClick={() => onActionClick('buy')}
                  disabled={prediction.confidence < 0.6}
                >
                  买入
                </Button>
                <Button
                  size="small"
                  type={prediction.suggestion === 'sell' ? 'primary' : 'default'}
                  onClick={() => onActionClick('sell')}
                  disabled={prediction.confidence < 0.6}
                >
                  卖出
                </Button>
                <Button
                  size="small"
                  type={prediction.suggestion === 'hold' ? 'primary' : 'default'}
                  onClick={() => onActionClick('hold')}
                >
                  持有
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIRecommendationCard

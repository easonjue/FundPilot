import React from 'react'
import { Space, Typography, Badge, Tooltip } from 'antd'
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  DisconnectOutlined 
} from '@ant-design/icons'

const { Text } = Typography

interface DataFreshnessIndicatorProps {
  lastUpdate: Date
  nextUpdate?: Date | null
  isUpdating?: boolean
  isMarketHours?: boolean
  maxStaleTime?: number // Maximum time in minutes before data is considered stale
  className?: string
}

const DataFreshnessIndicator: React.FC<DataFreshnessIndicatorProps> = ({
  lastUpdate,
  nextUpdate,
  isUpdating = false,
  isMarketHours = true,
  maxStaleTime = 10, // 10 minutes default
  className = ''
}) => {
  const now = new Date()
  const timeSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000 / 60) // minutes
  const isStale = timeSinceUpdate > maxStaleTime

  const getStatusConfig = () => {
    if (isUpdating) {
      return {
        status: 'processing' as const,
        icon: <ClockCircleOutlined spin />,
        color: 'blue',
        text: '更新中...',
        description: '正在获取最新数据'
      }
    }

    if (!isMarketHours) {
      return {
        status: 'default' as const,
        icon: <DisconnectOutlined />,
        color: 'gray',
        text: '休市中',
        description: '当前为非交易时间，数据暂停更新'
      }
    }

    if (isStale) {
      return {
        status: 'error' as const,
        icon: <ExclamationCircleOutlined />,
        color: 'red',
        text: '数据过期',
        description: `数据已过期 ${timeSinceUpdate} 分钟，请检查网络连接`
      }
    }

    return {
      status: 'success' as const,
      icon: <CheckCircleOutlined />,
      color: 'green',
      text: '数据正常',
      description: `数据更新于 ${timeSinceUpdate} 分钟前`
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatRelativeTime = (minutes: number) => {
    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes} 分钟前`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours} 小时 ${remainingMinutes} 分钟前` : `${hours} 小时前`
  }

  const config = getStatusConfig()

  const tooltipContent = (
    <div>
      <div>{config.description}</div>
      <div className="mt-1">
        <Text className="text-xs">
          上次更新: {formatTime(lastUpdate)}
        </Text>
      </div>
      {nextUpdate && (
        <div>
          <Text className="text-xs">
            下次更新: {formatTime(nextUpdate)}
          </Text>
        </div>
      )}
    </div>
  )

  return (
    <div className={className}>
      <Tooltip title={tooltipContent}>
        <Space size="small">
          <Badge 
            status={config.status} 
            text={
              <Text className="text-sm">
                {config.text}
              </Text>
            }
          />
          <Text className="text-xs text-gray-400">
            {formatRelativeTime(timeSinceUpdate)}
          </Text>
        </Space>
      </Tooltip>
    </div>
  )
}

export default DataFreshnessIndicator
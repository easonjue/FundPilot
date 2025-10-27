import {
  ExclamationCircleOutlined,
  ReloadOutlined,
  WifiOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Result, Button, Alert, Typography } from 'antd'
import React from 'react'
import type { APIError } from '@/types'

const { Text, Paragraph } = Typography

interface ErrorDisplayProps {
  error: APIError | Error | string
  onRetry?: () => void
  showDetails?: boolean
  className?: string
  size?: 'small' | 'default' | 'large'
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  showDetails = false,
  className = '',
  size = 'default',
}) => {
  // Parse error object
  const getErrorInfo = () => {
    if (typeof error === 'string') {
      return {
        code: 'UNKNOWN_ERROR',
        message: error,
        details: null,
        timestamp: new Date(),
      }
    }

    if (error instanceof Error) {
      return {
        code: 'CLIENT_ERROR',
        message: error.message,
        details: error.stack,
        timestamp: new Date(),
      }
    }

    return error as APIError
  }

  const errorInfo = getErrorInfo()

  // Get error icon and color based on error type
  const getErrorStyle = () => {
    switch (errorInfo.code) {
      case 'NETWORK_ERROR':
        return {
          icon: <WifiOutlined />,
          status: 'warning' as const,
          title: '网络连接失败',
          description: '请检查网络连接后重试',
        }
      case '401':
        return {
          icon: <ExclamationCircleOutlined />,
          status: 'error' as const,
          title: '认证失败',
          description: '请重新登录',
        }
      case '403':
        return {
          icon: <WarningOutlined />,
          status: 'warning' as const,
          title: '访问被拒绝',
          description: '您没有权限访问此资源',
        }
      case '404':
        return {
          icon: <ExclamationCircleOutlined />,
          status: 'info' as const,
          title: '资源不存在',
          description: '请求的资源未找到',
        }
      case '429':
        return {
          icon: <WarningOutlined />,
          status: 'warning' as const,
          title: '请求过于频繁',
          description: '请稍后再试',
        }
      case '500':
        return {
          icon: <ExclamationCircleOutlined />,
          status: 'error' as const,
          title: '服务器错误',
          description: '服务器遇到问题，请稍后再试',
        }
      default:
        return {
          icon: <ExclamationCircleOutlined />,
          status: 'error' as const,
          title: '操作失败',
          description: errorInfo.message || '发生未知错误',
        }
    }
  }

  const errorStyle = getErrorStyle()

  // Small size - just show alert
  if (size === 'small') {
    return (
      <Alert
        message={errorStyle.title}
        description={errorInfo.message}
        type={errorStyle.status}
        showIcon
        className={className}
        action={
          onRetry && (
            <Button size="small" onClick={onRetry} icon={<ReloadOutlined />}>
              重试
            </Button>
          )
        }
      />
    )
  }

  // Default/Large size - show full result
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <Result
        status={errorStyle.status}
        title={errorStyle.title}
        subTitle={errorStyle.description}
        extra={[
          onRetry && (
            <Button key="retry" type="primary" onClick={onRetry} icon={<ReloadOutlined />}>
              重试
            </Button>
          ),
          <Button key="back" onClick={() => window.history.back()}>
            返回
          </Button>,
        ].filter(Boolean)}
      >
        {showDetails && errorInfo.details && (
          <div className="mt-4">
            <Alert
              message="错误详情"
              description={
                <div>
                  <Paragraph>
                    <Text strong>错误代码:</Text> {errorInfo.code}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>时间:</Text> {errorInfo.timestamp.toLocaleString()}
                  </Paragraph>
                  {typeof errorInfo.details === 'string' ? (
                    <Paragraph>
                      <Text code>{errorInfo.details}</Text>
                    </Paragraph>
                  ) : (
                    <Paragraph>
                      <Text code>{JSON.stringify(errorInfo.details, null, 2)}</Text>
                    </Paragraph>
                  )}
                </div>
              }
              type="info"
              showIcon
              className="text-left"
            />
          </div>
        )}
      </Result>
    </div>
  )
}

export default ErrorDisplay

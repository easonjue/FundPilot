import { LoadingOutlined } from '@ant-design/icons'
import { Spin, Typography } from 'antd'
import React from 'react'

const { Text } = Typography

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large'
  message?: string
  spinning?: boolean
  children?: React.ReactNode
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  message,
  spinning = true,
  children,
  className = '',
}) => {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: size === 'large' ? 24 : size === 'small' ? 14 : 18 }}
      spin
    />
  )

  if (children) {
    return (
      <Spin spinning={spinning} indicator={antIcon} className={className}>
        {children}
      </Spin>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Spin size={size} indicator={antIcon} />
      {message && <Text className="mt-4 text-gray-500 dark:text-gray-400">{message}</Text>}
    </div>
  )
}

export default LoadingSpinner

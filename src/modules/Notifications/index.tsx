import React from 'react'
import { Card, Typography } from 'antd'

const { Title } = Typography

const Notifications: React.FC = () => {
  return (
    <div className="space-y-6">
      <Title level={2} className="mb-6">
        推送配置
      </Title>
      
      <Card className="card">
        <div className="h-96 flex items-center justify-center text-gray-500">
          推送配置模块将在后续任务中实现
        </div>
      </Card>
    </div>
  )
}

export default Notifications
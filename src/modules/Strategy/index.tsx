import { Card, Typography } from 'antd'
import React from 'react'

const { Title } = Typography

const Strategy: React.FC = () => {
  return (
    <div className="space-y-6">
      <Title level={2} className="mb-6">
        策略信号
      </Title>

      <Card className="card">
        <div className="h-96 flex items-center justify-center text-gray-500">
          策略信号模块将在后续任务中实现
        </div>
      </Card>
    </div>
  )
}

export default Strategy

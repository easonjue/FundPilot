import React from 'react'
import { Card, Space, Typography, Divider } from 'antd'
import WorldClock from './WorldClock'
import MarketTicker from './MarketTicker'
import { useI18n } from '@/hooks/useI18n'

const { Title, Text } = Typography

const TickerDemo: React.FC = () => {
  const { t } = useI18n()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <Title level={1}>金融信息展示系统演示</Title>
        <Text className="text-lg text-gray-600">
          世界时钟 + 市场滚动条 + 新闻资讯
        </Text>
      </div>

      {/* 世界时钟完整模式 */}
      <Card title="🌍 世界时钟 - 完整模式" className="mb-6">
        <WorldClock />
      </Card>

      {/* 世界时钟紧凑模式 */}
      <Card title="⏰ 世界时钟 - 紧凑模式（用于顶部状态栏）" className="mb-6">
        <div className="flex justify-center">
          <WorldClock compact />
        </div>
      </Card>

      <Divider />

      {/* 市场滚动条演示 */}
      <Card title="📈 市场滚动条演示" className="mb-6">
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <Text strong>双层滚动设计：</Text>
            <ul className="mt-2 ml-4">
              <li>上层：全球主要股指实时数据</li>
              <li>下层：重要财经新闻资讯</li>
              <li>悬停暂停，便于阅读</li>
              <li>渐变边缘遮罩效果</li>
            </ul>
          </div>
          
          <div className="relative">
            <MarketTicker height={100} speed={40} showNews={true} />
          </div>
        </Space>
      </Card>

      {/* 功能特性说明 */}
      <Card title="✨ 功能特性" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Title level={4}>🌍 世界时钟</Title>
            <ul className="space-y-2">
              <li>• 6大金融中心实时时间</li>
              <li>• 智能市场开盘/闭盘状态</li>
              <li>• 动态脉冲效果</li>
              <li>• 紧凑/完整两种模式</li>
              <li>• 响应式设计</li>
            </ul>
          </div>
          
          <div>
            <Title level={4}>📈 市场滚动条</Title>
            <ul className="space-y-2">
              <li>• 10大全球股指实时数据</li>
              <li>• 重要财经新闻滚动</li>
              <li>• 影响力分级显示</li>
              <li>• 悬停暂停功能</li>
              <li>• 自动数据更新</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 技术说明 */}
      <Card title="🔧 技术实现" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Title level={5}>性能优化</Title>
            <Text>CSS动画 + GPU加速</Text>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Title level={5}>数据服务</Title>
            <Text>统一API + 自动降级</Text>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Title level={5}>国际化</Title>
            <Text>多语言 + 本地化格式</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TickerDemo
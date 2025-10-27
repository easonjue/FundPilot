import { Card, Typography, Space, Divider } from 'antd'
import React from 'react'
import MarketTicker from './MarketTicker'

const { Title, Text } = Typography

const MarketTickerTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <Title level={1}>底部滚动条测试</Title>
          <Text className="text-lg">测试市场数据和新闻信息的单行横向滚动效果</Text>
        </div>

        <Space direction="vertical" size="large" className="w-full">
          {/* 不同高度的测试 */}
          <Card title="高度 60px" className="w-full">
            <div className="relative">
              <MarketTicker height={60} speed={40} showNews={true} />
            </div>
          </Card>

          <Card title="高度 70px（推荐）" className="w-full">
            <div className="relative">
              <MarketTicker height={70} speed={50} showNews={true} />
            </div>
          </Card>

          <Card title="高度 80px" className="w-full">
            <div className="relative">
              <MarketTicker height={80} speed={60} showNews={true} />
            </div>
          </Card>

          <Divider />

          {/* 只显示市场数据 */}
          <Card title="仅市场数据（无新闻）" className="w-full">
            <div className="relative">
              <MarketTicker height={70} speed={50} showNews={false} />
            </div>
          </Card>

          <Divider />

          {/* 说明文档 */}
          <Card title="修复说明" className="w-full">
            <Space direction="vertical" size="middle">
              <div>
                <Title level={4}>✅ 已修复的问题：</Title>
                <ul className="list-disc ml-6 space-y-2">
                  <li>市场数据和新闻不再相互遮挡</li>
                  <li>改为单行横向滚动显示</li>
                  <li>添加了底部边距（padding-bottom）</li>
                  <li>统一了项目高度，避免布局错乱</li>
                  <li>优化了渐变遮罩效果</li>
                </ul>
              </div>

              <div>
                <Title level={4}>🎨 设计改进：</Title>
                <ul className="list-disc ml-6 space-y-2">
                  <li>市场数据和新闻按 2:1 比例混合显示</li>
                  <li>固定项目高度为 50px，确保对齐</li>
                  <li>新闻标题改为单行显示，避免高度不一致</li>
                  <li>增强了悬停效果和视觉反馈</li>
                  <li>优化了渐变边缘遮罩</li>
                </ul>
              </div>

              <div>
                <Title level={4}>⚙️ 技术优化：</Title>
                <ul className="list-disc ml-6 space-y-2">
                  <li>使用 flex-shrink: 0 防止项目被压缩</li>
                  <li>动态计算动画时长，确保流畅滚动</li>
                  <li>三倍内容重复，实现真正的无缝循环</li>
                  <li>响应式设计，适配不同屏幕尺寸</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Space>
      </div>
    </div>
  )
}

export default MarketTickerTest

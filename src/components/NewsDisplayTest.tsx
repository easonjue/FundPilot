import { Card, Typography, Space, Divider } from 'antd'
import React from 'react'
import MarketTicker from './MarketTicker'

const { Title, Text } = Typography

const NewsDisplayTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Title level={1}>新闻文字显示测试</Title>
          <Text className="text-lg">测试新闻文字是否完整显示，不被隐藏</Text>
        </div>

        <Space direction="vertical" size="large" className="w-full">
          {/* 标准高度测试 */}
          <Card title="标准高度 70px - 修复后" className="w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <MarketTicker height={70} speed={40} showNews={true} />
            </div>
          </Card>

          <Divider />

          {/* 不同高度对比 */}
          <Card title="高度对比测试" className="w-full">
            <Space direction="vertical" size="middle" className="w-full">
              <div>
                <Text strong>高度 60px：</Text>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-2">
                  <MarketTicker height={60} speed={40} showNews={true} />
                </div>
              </div>

              <div>
                <Text strong>高度 80px：</Text>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-2">
                  <MarketTicker height={80} speed={40} showNews={true} />
                </div>
              </div>
            </Space>
          </Card>

          <Divider />

          {/* 修复说明 */}
          <Card title="修复详情" className="w-full">
            <Space direction="vertical" size="middle">
              <div>
                <Title level={4}>🔧 修复的问题：</Title>
                <ul className="list-disc ml-6 space-y-2">
                  <li>
                    <strong>布局改进</strong>：将新闻项从垂直布局改为水平布局
                  </li>
                  <li>
                    <strong>移除overflow hidden</strong>：避免内容被裁剪
                  </li>
                  <li>
                    <strong>优化文字容器</strong>：添加独立的 newsContent 容器
                  </li>
                  <li>
                    <strong>防止压缩</strong>：使用 flex-shrink: 0 保护关键元素
                  </li>
                  <li>
                    <strong>改进文字截断</strong>：使用更合理的文字截断策略
                  </li>
                </ul>
              </div>

              <div>
                <Title level={4}>🎨 新的布局结构：</Title>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
                  <div>newsItem (水平布局)</div>
                  <div className="ml-4">├── newsHeader (固定宽度)</div>
                  <div className="ml-8">│ ├── impactDot</div>
                  <div className="ml-8">│ ├── newsTime</div>
                  <div className="ml-8">│ └── newsCategory</div>
                  <div className="ml-4">└── newsContent (弹性宽度)</div>
                  <div className="ml-8"> └── newsTitle</div>
                </div>
              </div>

              <div>
                <Title level={4}>✨ 视觉改进：</Title>
                <ul className="list-disc ml-6 space-y-2">
                  <li>新闻标题字体大小调整为 font-size-sm，更易阅读</li>
                  <li>时间和分类标签字体调整为 10px，节省空间</li>
                  <li>添加合适的间距和边距</li>
                  <li>保持与市场数据项一致的高度</li>
                  <li>优化悬停效果和视觉反馈</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Space>
      </div>
    </div>
  )
}

export default NewsDisplayTest

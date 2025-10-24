import React from 'react'
import { Typography, Avatar, Badge, Button, Space } from 'antd'
import { 
  BellOutlined, 
  UserOutlined,
  SunOutlined,
  MoonOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useThemeStore } from '@/stores/themeStore'

const { Title, Text } = Typography

const MobileHeader: React.FC = () => {
  const { isDark, toggleTheme } = useThemeStore()

  const getCurrentGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Greeting and User Info */}
          <div className="flex items-center space-x-4">
            <Avatar 
              size={48}
              icon={<UserOutlined />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white shadow-lg"
            />
            <div>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {getCurrentGreeting()}
              </Text>
              <Title level={4} className="mb-0 text-gray-900 dark:text-gray-100">
                投资者
              </Title>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              type="text"
              shape="circle"
              icon={<SearchOutlined />}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
            />
            <Button
              type="text"
              shape="circle"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
            />
            <Badge count={3} size="small">
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined />}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
              />
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
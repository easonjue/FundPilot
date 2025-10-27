import {
  DashboardOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavItem {
  key: string
  icon: React.ReactNode
  label: string
  path: string
}

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '首页',
      path: '/dashboard',
    },
    {
      key: 'analysis',
      icon: <LineChartOutlined />,
      label: '分析',
      path: '/analysis',
    },
    {
      key: 'strategy',
      icon: <ThunderboltOutlined />,
      label: '策略',
      path: '/strategy',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: '通知',
      path: '/notifications',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      path: '/settings',
    },
  ]

  const handleNavClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.path)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div
                className={`text-xl mb-1 transition-transform duration-200 ${
                  isActive ? 'scale-110' : 'scale-100'
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default BottomNavigation

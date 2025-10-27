import {
  DashboardOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import type { MenuProps } from 'antd'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

type MenuItem = Required<MenuProps>['items'][number]

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems: MenuItem[] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/analysis',
      icon: <LineChartOutlined />,
      label: '基金分析',
    },
    {
      key: '/strategy',
      icon: <ThunderboltOutlined />,
      label: '策略信号',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: '推送配置',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      width={240}
      theme="light"
      breakpoint="lg"
      collapsedWidth={80}
    >
      <div className="h-20 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          {!collapsed && (
            <div className="text-white">
              <div className="text-xl font-bold">FundPilot</div>
              <div className="text-xs opacity-80">智能投资助手</div>
            </div>
          )}
        </div>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-r-0 bg-transparent"
      />
    </Sider>
  )
}

export default Sidebar

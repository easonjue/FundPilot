import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons'
import { Layout, Button, Space, Avatar, Dropdown, Badge } from 'antd'
import type { MenuProps } from 'antd'
import React from 'react'
import { useThemeStore } from '@/stores/themeStore'

const { Header: AntHeader } = Layout

interface HeaderProps {
  collapsed: boolean
  onToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const { isDark, toggleTheme } = useThemeStore()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  return (
    <AntHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="text-lg"
        />
      </div>

      <Space size="middle">
        <Button
          type="text"
          icon={isDark ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className="text-lg"
        />

        <Badge count={3} size="small">
          <Button type="text" icon={<BellOutlined />} className="text-lg" />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar icon={<UserOutlined />} className="cursor-pointer bg-primary-500" />
        </Dropdown>
      </Space>
    </AntHeader>
  )
}

export default Header

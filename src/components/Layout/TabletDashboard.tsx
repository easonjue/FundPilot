import React from 'react'
import { Typography, Avatar, Button, Badge } from 'antd'
import {
  DashboardOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useThemeStore } from '@/stores/themeStore'
import styles from './TabletDashboard.module.less'

const { Title, Text } = Typography

interface TabletDashboardProps {
  children: React.ReactNode
  orientation: 'portrait' | 'landscape'
}

const TabletDashboard: React.FC<TabletDashboardProps> = ({ children, orientation }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useThemeStore()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const navItems = [
    { key: 'dashboard', icon: DashboardOutlined, label: '仪表盘', path: '/dashboard' },
    { key: 'analysis', icon: LineChartOutlined, label: '分析', path: '/analysis' },
    { key: 'strategy', icon: ThunderboltOutlined, label: '策略', path: '/strategy' },
    { key: 'notifications', icon: BellOutlined, label: '通知', path: '/notifications' },
    { key: 'settings', icon: SettingOutlined, label: '设置', path: '/settings' }
  ]

  return (
    <div className={`${styles.tablet} ${styles[orientation]} ${isDark ? styles.dark : styles.light}`}>
      {/* 顶部导航栏 */}
      <div className={styles.topBar}>
        <div className={styles.leftSection}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMenuOpen(!menuOpen)}
            className={styles.menuButton}
          />
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <Title level={4} className={styles.logoText}>FundPilot</Title>
          </div>
        </div>

        <div className={styles.centerSection}>
          <div className={styles.navTabs}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon
              return (
                <div
                  key={item.key}
                  className={`${styles.navTab} ${isActive ? styles.active : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <IconComponent className={styles.tabIcon} />
                  <span className={styles.tabLabel}>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.rightSection}>
          <Badge count={3} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              className={styles.actionButton}
            />
          </Badge>
          <Avatar
            size={36}
            icon={<UserOutlined />}
            className={styles.avatar}
          />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  )
}

export default TabletDashboard
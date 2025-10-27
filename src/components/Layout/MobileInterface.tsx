import {
  DashboardOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Typography, Avatar, Button, Badge } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './MobileInterface.module.less'
import { useThemeStore } from '@/stores/themeStore'

const { Title, Text } = Typography

interface MobileInterfaceProps {
  children: React.ReactNode
}

const MobileInterface: React.FC<MobileInterfaceProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { isDark } = useThemeStore()

  const navItems = [
    {
      key: 'dashboard',
      icon: DashboardOutlined,
      label: t('navigation.dashboard'),
      path: '/dashboard',
    },
    {
      key: 'analysis',
      icon: LineChartOutlined,
      label: t('navigation.analysis'),
      path: '/analysis',
    },
    {
      key: 'strategy',
      icon: ThunderboltOutlined,
      label: t('navigation.strategy'),
      path: '/strategy',
    },
    {
      key: 'notifications',
      icon: BellOutlined,
      label: t('navigation.notifications'),
      path: '/notifications',
    },
    { key: 'settings', icon: SettingOutlined, label: t('navigation.settings'), path: '/settings' },
  ]

  const getCurrentGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('greeting.morning')
    if (hour < 18) return t('greeting.afternoon')
    return t('greeting.evening')
  }

  return (
    <div className={`${styles.mobile} ${isDark ? styles.dark : styles.light}`}>
      {/* 顶部状态栏 */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <div className={styles.greeting}>
            <Text className={styles.greetingText}>{getCurrentGreeting()}</Text>
            <Title level={5} className={styles.userName}>
              {t('greeting.investor')}
            </Title>
          </div>
        </div>

        <div className={styles.statusRight}>
          <Button type="text" icon={<SearchOutlined />} className={styles.statusButton} />
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined />} className={styles.statusButton} />
          </Badge>
          <Avatar size={32} icon={<UserOutlined />} className={styles.avatar} />
        </div>
      </div>

      {/* 主内容区域 */}
      <div className={styles.mainContent}>{children}</div>

      {/* 底部导航栏 */}
      <div className={styles.bottomNav}>
        <div className={styles.navContainer}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const IconComponent = item.icon
            return (
              <div
                key={item.key}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                onClick={() => navigate(item.path)}
              >
                <div className={styles.navIcon}>
                  <IconComponent />
                </div>
                <span className={styles.navLabel}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileInterface

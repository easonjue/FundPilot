import {
  DashboardOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  FullscreenOutlined,
  SunOutlined,
  MoonOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import { Typography, Avatar, Badge, Button, Tooltip } from 'antd'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './DesktopCockpit.module.less'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MarketTicker from '@/components/MarketTicker'
import WorldClock from '@/components/WorldClock'
import { useThemeStore } from '@/stores/themeStore'

const { Title, Text } = Typography

interface DesktopCockpitProps {
  children: React.ReactNode
}

const DesktopCockpit: React.FC<DesktopCockpitProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useThemeStore()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [_currentTime, setCurrentTime] = useState('')
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const _getCurrentDate = () => {
    return new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTime())
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className={`${styles.cockpit} ${isDark ? styles.dark : styles.light}`}>
      {/* 顶部状态栏 - 类似飞机驾驶舱 */}
      <div className={styles.statusBar}>
        <div className={styles.leftStatus}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <Title level={4} className={styles.logoText}>
              FundPilot
            </Title>
          </div>
          <div className={styles.systemStatus}>
            <div className={styles.statusIndicator}>
              <div className={`${styles.statusLight} ${styles.online}`}></div>
              <Text className={styles.statusText}>{t('layout.systemOnline')}</Text>
            </div>
            <div className={styles.statusIndicator}>
              <div className={`${styles.statusLight} ${styles.active}`}></div>
              <Text className={styles.statusText}>{t('layout.dataSync')}</Text>
            </div>
          </div>
        </div>

        <div className={styles.centerStatus}>
          <WorldClock compact />
        </div>

        <div className={styles.rightStatus}>
          <div className={styles.controlButtons}>
            <Tooltip title={t('common.search')}>
              <Button type="text" icon={<SearchOutlined />} className={styles.controlButton} />
            </Tooltip>
            <LanguageSwitcher type="text" size="middle" />
            <Tooltip title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}>
              <Button
                type="text"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                className={styles.controlButton}
              />
            </Tooltip>
            <Tooltip title={isFullscreen ? t('common.exitFullscreen') : t('common.fullscreen')}>
              <Button
                type="text"
                icon={<FullscreenOutlined />}
                onClick={toggleFullscreen}
                className={styles.controlButton}
              />
            </Tooltip>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} className={styles.controlButton} />
            </Badge>
          </div>
          <div className={styles.userProfile}>
            <Avatar size={40} icon={<UserOutlined />} className={styles.avatar} />
            <div className={styles.userInfo}>
              <Text className={styles.userName}>{t('greeting.investor')}</Text>
              <Text className={styles.userRole}>{t('greeting.professionalVersion')}</Text>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className={styles.mainArea}>
        {/* 左侧导航面板 - 垂直仪表盘风格 */}
        <div
          className={`${styles.navigationPanel} ${isNavCollapsed ? styles.collapsed : styles.expanded}`}
        >
          {/* 收起/展开按钮 */}
          <div className={styles.navHeader}>
            <Tooltip title={isNavCollapsed ? '展开导航' : '收起导航'} placement="right">
              <Button
                type="text"
                icon={isNavCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setIsNavCollapsed(!isNavCollapsed)}
                className={styles.collapseButton}
              />
            </Tooltip>
            {!isNavCollapsed && (
              <div className={styles.navTitle}>
                <Text className={styles.navTitleText}>{t('navigation.navigationCenter')}</Text>
              </div>
            )}
          </div>

          <div className={styles.navItems}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path
              const IconComponent = item.icon
              return (
                <Tooltip
                  key={item.key}
                  title={isNavCollapsed ? item.label : ''}
                  placement="right"
                  mouseEnterDelay={0.5}
                >
                  <div
                    className={`${styles.navItem} ${isActive ? styles.active : ''} ${isNavCollapsed ? styles.iconOnly : ''}`}
                    onClick={() => navigate(item.path)}
                  >
                    <div className={styles.navIcon}>
                      <IconComponent />
                    </div>
                    {!isNavCollapsed && <div className={styles.navLabel}>{item.label}</div>}
                    {isActive && <div className={styles.activeIndicator}></div>}
                  </div>
                </Tooltip>
              )
            })}
          </div>

          {/* 系统监控小部件 - 只在展开时显示 */}
          {!isNavCollapsed && (
            <div className={styles.systemMonitor}>
              <div className={styles.monitorTitle}>{t('layout.systemMonitoring')}</div>
              <div className={styles.monitorItem}>
                <Text className={styles.monitorLabel}>{t('layout.cpu')}</Text>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '45%' }}></div>
                </div>
                <Text className={styles.monitorValue}>45%</Text>
              </div>
              <div className={styles.monitorItem}>
                <Text className={styles.monitorLabel}>{t('layout.memory')}</Text>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '62%' }}></div>
                </div>
                <Text className={styles.monitorValue}>62%</Text>
              </div>
              <div className={styles.monitorItem}>
                <Text className={styles.monitorLabel}>{t('layout.network')}</Text>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '28%' }}></div>
                </div>
                <Text className={styles.monitorValue}>28%</Text>
              </div>
            </div>
          )}
        </div>

        {/* 内容区域 */}
        <div className={styles.contentArea}>
          <div className={styles.contentWrapper}>{children}</div>
        </div>

        {/* 右侧信息面板 */}
        <div className={styles.infoPanel}>
          <div className={styles.infoPanelTitle}>
            <Text className={styles.infoPanelTitleText}>{t('navigation.realTimeMonitoring')}</Text>
          </div>

          {/* 市场状态 */}
          <div className={styles.marketStatus}>
            <div className={styles.marketTitle}>{t('layout.marketStatus')}</div>
            <div className={styles.marketItem}>
              <div className={styles.marketDot} style={{ backgroundColor: '#10b981' }}></div>
              <Text>
                {t('market.shanghaiShenzhen300')} {t('market.open')}
              </Text>
            </div>
            <div className={styles.marketItem}>
              <div className={styles.marketDot} style={{ backgroundColor: '#f59e0b' }}></div>
              <Text>
                {t('market.hongKongStock')} {t('market.suspended')}
              </Text>
            </div>
            <div className={styles.marketItem}>
              <div className={styles.marketDot} style={{ backgroundColor: '#ef4444' }}></div>
              <Text>
                {t('market.usStock')} {t('market.closed')}
              </Text>
            </div>
          </div>

          {/* 快速操作 */}
          <div className={styles.quickActions}>
            <div className={styles.quickTitle}>{t('layout.quickActions')}</div>
            <Button className={styles.quickButton} block>
              {t('layout.refreshData')}
            </Button>
            <Button className={styles.quickButton} block>
              {t('layout.exportReport')}
            </Button>
            <Button className={styles.quickButton} block>
              {t('layout.riskAssessment')}
            </Button>
          </div>

          {/* AI助手 */}
          <div className={styles.aiAssistant}>
            <div className={styles.aiTitle}>
              <span className={styles.aiIcon}>🤖</span>
              {t('layout.aiAssistant')}
            </div>
            <div className={styles.aiMessage}>
              <Text className={styles.aiText}>
                {t('ai.riskWarning')}，{t('ai.suggestedActions')}。
              </Text>
            </div>
            <Button size="small" className={styles.aiButton}>
              {t('layout.viewSuggestions')}
            </Button>
          </div>
        </div>
      </div>

      {/* 底部市场滚动条 */}
      <div className={styles.bottomTicker}>
        <MarketTicker height={70} speed={50} showNews={true} />
      </div>
    </div>
  )
}

export default DesktopCockpit

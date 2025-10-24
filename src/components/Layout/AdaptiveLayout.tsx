import React from 'react'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import DesktopCockpit from './DesktopCockpit'
import TabletDashboard from './TabletDashboard'
import MobileInterface from './MobileInterface'

interface AdaptiveLayoutProps {
  children: React.ReactNode
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({ children }) => {
  const { deviceType, orientation } = useDeviceDetection()

  // 桌面端：驾驶舱式布局
  if (deviceType === 'desktop') {
    return <DesktopCockpit>{children}</DesktopCockpit>
  }

  // 平板端：仪表盘式布局
  if (deviceType === 'tablet') {
    return <TabletDashboard orientation={orientation}>{children}</TabletDashboard>
  }

  // 手机端：卡片流式布局
  return <MobileInterface>{children}</MobileInterface>
}

export default AdaptiveLayout
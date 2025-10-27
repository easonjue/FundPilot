import { useState, useEffect } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  orientation: 'portrait' | 'landscape'
  pixelRatio: number
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // 初始化时的默认值
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080
    const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1

    const isMobile = width < 768
    const isTablet = width >= 768 && width < 1024
    const isDesktop = width >= 1024
    const orientation = width > height ? 'landscape' : 'portrait'

    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (isMobile) deviceType = 'mobile'
    else if (isTablet) deviceType = 'tablet'

    return {
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      deviceType,
      orientation,
      pixelRatio,
    }
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const pixelRatio = window.devicePixelRatio
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      const orientation = width > height ? 'landscape' : 'portrait'

      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (isMobile) deviceType = 'mobile'
      else if (isTablet) deviceType = 'tablet'

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        deviceType,
        orientation,
        pixelRatio,
      })
    }

    // 初始检测
    updateDeviceInfo()

    // 监听窗口大小变化
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

export default useDeviceDetection

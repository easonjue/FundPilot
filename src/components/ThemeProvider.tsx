import React, { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { mode, isDark, setDarkMode } = useThemeStore()

  useEffect(() => {
    // 初始化主题
    const applyTheme = (dark: boolean) => {
      const root = document.documentElement
      if (dark) {
        root.setAttribute('data-theme', 'dark')
        root.classList.add('dark')
      } else {
        root.setAttribute('data-theme', 'light')
        root.classList.remove('dark')
      }
    }

    // 应用当前主题
    applyTheme(isDark)

    // 如果是自动模式，监听系统主题变化
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = (e: MediaQueryListEvent) => {
        setDarkMode(e.matches)
      }

      mediaQuery.addEventListener('change', handleChange)

      // 初始设置
      setDarkMode(mediaQuery.matches)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }
  }, [mode, isDark, setDarkMode])

  return <>{children}</>
}

export default ThemeProvider

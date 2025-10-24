import { FC } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'
import AppRouter from '@/components/AppRouter'
import ErrorBoundary from '@/components/ErrorBoundary'
import ThemeProvider from '@/components/ThemeProvider'
import LanguageProvider from '@/components/LanguageProvider'
import '@/i18n' // 初始化i18n

// 导入Ant Design语言包
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import jaJP from 'antd/locale/ja_JP'

const App: FC = () => {
  const { isDark } = useThemeStore()
  const { currentLanguage } = useLanguageStore()

  // 根据当前语言获取Ant Design语言包
  const getAntdLocale = () => {
    switch (currentLanguage) {
      case 'en-US':
        return enUS
      case 'ja-JP':
        return jaJP
      case 'zh-CN':
      default:
        return zhCN
    }
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <ConfigProvider
          locale={getAntdLocale()}
          theme={{
            algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
              colorPrimary: '#3b82f6',
              colorSuccess: '#10b981',
              colorError: '#ef4444',
              colorWarning: '#f59e0b',
              colorInfo: '#3b82f6',
              borderRadius: 8,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
              fontSize: 14,
              lineHeight: 1.5,
            },
            components: {
              Button: {
                borderRadius: 8,
                controlHeight: 40,
                fontWeight: 500,
              },
              Card: {
                borderRadius: 16,
                paddingLG: 24,
              },
              Input: {
                borderRadius: 8,
                controlHeight: 40,
              },
              Select: {
                borderRadius: 8,
                controlHeight: 40,
              },
              Modal: {
                borderRadius: 16,
              },
              Drawer: {
                borderRadius: 16,
              },
            },
          }}
        >
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ConfigProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
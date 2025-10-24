import React, { useEffect } from 'react'
import { useLanguageStore } from '@/stores/languageStore'

interface LanguageProviderProps {
  children: React.ReactNode
}

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { currentLanguage, setLanguage } = useLanguageStore()

  useEffect(() => {
    // 初始化语言设置
    const initializeLanguage = () => {
      // 如果没有保存的语言设置，尝试从浏览器检测
      if (!currentLanguage) {
        const browserLanguage = navigator.language || navigator.languages[0]
        
        // 映射浏览器语言到支持的语言
        if (browserLanguage.startsWith('zh')) {
          setLanguage('zh-CN')
        } else if (browserLanguage.startsWith('ja')) {
          setLanguage('ja-JP')
        } else {
          setLanguage('en-US')
        }
      }
    }

    initializeLanguage()
  }, [currentLanguage, setLanguage])

  return <>{children}</>
}

export default LanguageProvider
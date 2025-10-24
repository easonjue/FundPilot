import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// 导入语言资源
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import jaJP from './locales/ja-JP.json'

// 支持的语言列表
export const supportedLanguages = [
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'en-US', name: 'English', nativeName: 'English' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' }
] as const

export type SupportedLanguage = typeof supportedLanguages[number]['code']

// 语言资源
const resources = {
  'zh-CN': { translation: zhCN },
  'en-US': { translation: enUS },
  'ja-JP': { translation: jaJP }
}

// 初始化i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    debug: process.env.NODE_ENV === 'development',
    
    // 语言检测配置
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'fundpilot-language'
    },
    
    interpolation: {
      escapeValue: false // React已经默认转义
    },
    
    // 命名空间配置
    defaultNS: 'translation',
    ns: ['translation'],
    
    // 键分隔符
    keySeparator: '.',
    nsSeparator: ':',
    
    // 复数规则
    pluralSeparator: '_',
    
    // 上下文分隔符
    contextSeparator: '_'
  })

export default i18n
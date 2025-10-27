import { useTranslation } from 'react-i18next'
import type { SupportedLanguage } from '@/i18n'
import { useLanguageStore } from '@/stores/languageStore'

/**
 * 国际化Hook，提供便捷的翻译和语言管理功能
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation()
  const {
    currentLanguage,
    availableLanguages,
    setLanguage,
    getLanguageName,
    getNativeLanguageName,
  } = useLanguageStore()

  /**
   * 翻译函数，支持插值
   */
  const translate = (key: string, options?: any) => {
    return t(key, options)
  }

  /**
   * 格式化数字
   */
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value)
  }

  /**
   * 格式化货币
   */
  const formatCurrency = (value: number, currency: string = 'CNY') => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    // 根据语言调整默认货币
    const defaultCurrency =
      currentLanguage === 'zh-CN' ? 'CNY' : currentLanguage === 'ja-JP' ? 'JPY' : 'USD'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || defaultCurrency,
    }).format(value)
  }

  /**
   * 格式化百分比
   */
  const formatPercent = (value: number, options?: Intl.NumberFormatOptions) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options,
    }).format(value / 100)
  }

  /**
   * 格式化日期
   */
  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date))
  }

  /**
   * 格式化时间
   */
  const formatTime = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    const defaultOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date))
  }

  /**
   * 格式化日期时间
   */
  const formatDateTime = (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }

    return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date))
  }

  /**
   * 获取相对时间（如：2小时前）
   */
  const formatRelativeTime = (date: Date | string | number) => {
    const locale =
      currentLanguage === 'zh-CN' ? 'zh-CN' : currentLanguage === 'ja-JP' ? 'ja-JP' : 'en-US'

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    const now = new Date()
    const targetDate = new Date(date)
    const diffInSeconds = (targetDate.getTime() - now.getTime()) / 1000

    const intervals = [
      { unit: 'year' as const, seconds: 31536000 },
      { unit: 'month' as const, seconds: 2592000 },
      { unit: 'day' as const, seconds: 86400 },
      { unit: 'hour' as const, seconds: 3600 },
      { unit: 'minute' as const, seconds: 60 },
      { unit: 'second' as const, seconds: 1 },
    ]

    for (const interval of intervals) {
      const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
      if (count >= 1) {
        return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit)
      }
    }

    return rtf.format(0, 'second')
  }

  /**
   * 切换语言
   */
  const switchLanguage = (language: SupportedLanguage) => {
    setLanguage(language)
  }

  /**
   * 检查是否为RTL语言
   */
  const isRTL = () => {
    // 目前支持的语言都是LTR，如果以后添加阿拉伯语等RTL语言需要更新
    return false
  }

  return {
    // 基础翻译
    t: translate,

    // 语言管理
    currentLanguage,
    availableLanguages,
    switchLanguage,
    getLanguageName,
    getNativeLanguageName,
    isRTL,

    // 格式化函数
    formatNumber,
    formatCurrency,
    formatPercent,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,

    // i18n实例（用于高级用法）
    i18n,
  }
}

export default useI18n

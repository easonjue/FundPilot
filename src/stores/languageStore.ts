import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '@/i18n'
import { SupportedLanguage, supportedLanguages } from '@/i18n'

interface LanguageState {
  currentLanguage: SupportedLanguage
  availableLanguages: typeof supportedLanguages
  setLanguage: (language: SupportedLanguage) => void
  getLanguageName: (code: SupportedLanguage) => string
  getNativeLanguageName: (code: SupportedLanguage) => string
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, _get) => ({
      currentLanguage: 'zh-CN',
      availableLanguages: supportedLanguages,

      setLanguage: (language: SupportedLanguage) => {
        // 更新i18n语言
        i18n.changeLanguage(language)

        // 更新状态
        set({ currentLanguage: language })

        // 更新HTML lang属性
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language
        }

        // 更新dayjs语言（如果使用了dayjs）
        if (typeof window !== 'undefined') {
          import('dayjs/locale/zh-cn').then(async () => {
            const dayjs = await import('dayjs')
            switch (language) {
              case 'zh-CN':
                dayjs.default.locale('zh-cn')
                break
              case 'en-US':
                dayjs.default.locale('en')
                break
              case 'ja-JP':
                import('dayjs/locale/ja').then(() => {
                  dayjs.default.locale('ja')
                })
                break
            }
          })
        }
      },

      getLanguageName: (code: SupportedLanguage) => {
        const language = supportedLanguages.find(lang => lang.code === code)
        return language?.name || code
      },

      getNativeLanguageName: (code: SupportedLanguage) => {
        const language = supportedLanguages.find(lang => lang.code === code)
        return language?.nativeName || code
      },
    }),
    {
      name: 'fundpilot-language',
      onRehydrateStorage: () => state => {
        if (state) {
          // 恢复语言设置
          i18n.changeLanguage(state.currentLanguage)

          // 更新HTML lang属性
          if (typeof document !== 'undefined') {
            document.documentElement.lang = state.currentLanguage
          }
        }
      },
    }
  )
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeState {
  mode: ThemeMode
  isDark: boolean
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
  setDarkMode: (isDark: boolean) => void
}

const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const applyTheme = (isDark: boolean) => {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  if (isDark) {
    root.setAttribute('data-theme', 'dark')
    root.classList.add('dark')
  } else {
    root.setAttribute('data-theme', 'light')
    root.classList.remove('dark')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'auto',
      isDark: getSystemTheme(),
      
      toggleTheme: () => {
        const { isDark } = get()
        const newMode: ThemeMode = isDark ? 'light' : 'dark'
        const newIsDark = newMode === 'dark'
        
        set({ mode: newMode, isDark: newIsDark })
        applyTheme(newIsDark)
      },
      
      setTheme: (mode: ThemeMode) => {
        let isDark: boolean
        
        if (mode === 'auto') {
          isDark = getSystemTheme()
        } else {
          isDark = mode === 'dark'
        }
        
        set({ mode, isDark })
        applyTheme(isDark)
      },
      
      setDarkMode: (isDark: boolean) => {
        set({ isDark })
        applyTheme(isDark)
      }
    }),
    {
      name: 'fundpilot-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 恢复主题状态时应用主题
          if (state.mode === 'auto') {
            const systemIsDark = getSystemTheme()
            state.setDarkMode(systemIsDark)
          } else {
            applyTheme(state.isDark)
          }
          
          // 监听系统主题变化
          if (typeof window !== 'undefined' && state.mode === 'auto') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            const handleChange = (e: MediaQueryListEvent) => {
              if (state.mode === 'auto') {
                state.setDarkMode(e.matches)
              }
            }
            mediaQuery.addEventListener('change', handleChange)
          }
        }
      }
    }
  )
)
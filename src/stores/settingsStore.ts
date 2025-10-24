import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserSettings, NotificationConfig } from '@/types'

interface SettingsState extends UserSettings {
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Actions
  updateSettings: (settings: Partial<UserSettings>) => void
  updateNotifications: (config: Partial<NotificationConfig>) => void
  addToWatchlist: (fundCode: string) => void
  removeFromWatchlist: (fundCode: string) => void
  setApiKey: (service: string, key: string) => void
  removeApiKey: (service: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetSettings: () => void
}

const defaultNotificationConfig: NotificationConfig = {
  enabled: false,
  channels: [],
  frequency: 'daily',
  schedule: '0 18 * * *', // Daily at 6 PM
  credentials: {}
}

const defaultSettings: UserSettings = {
  theme: 'light',
  watchlist: [],
  notifications: defaultNotificationConfig,
  apiKeys: {},
  dataSync: 'local'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultSettings,
      isLoading: false,
      error: null,
      
      // Actions
      updateSettings: (newSettings) => set((state) => ({
        ...state,
        ...newSettings
      })),
      
      updateNotifications: (config) => set((state) => ({
        notifications: { ...state.notifications, ...config }
      })),
      
      addToWatchlist: (fundCode) => set((state) => ({
        watchlist: state.watchlist.includes(fundCode) 
          ? state.watchlist 
          : [...state.watchlist, fundCode]
      })),
      
      removeFromWatchlist: (fundCode) => set((state) => ({
        watchlist: state.watchlist.filter(code => code !== fundCode)
      })),
      
      setApiKey: (service, key) => set((state) => ({
        apiKeys: { ...state.apiKeys, [service]: key }
      })),
      
      removeApiKey: (service) => set((state) => {
        const { [service]: removed, ...rest } = state.apiKeys
        return { apiKeys: rest }
      }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      resetSettings: () => set({
        ...defaultSettings,
        isLoading: false,
        error: null
      })
    }),
    {
      name: 'fundpilot-settings'
    }
  )
)
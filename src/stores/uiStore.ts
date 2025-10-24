import { create } from 'zustand'

interface UIState {
  // Layout state
  sidebarCollapsed: boolean
  
  // Loading states
  globalLoading: boolean
  loadingMessage: string
  
  // Modal and drawer states
  modals: Record<string, boolean>
  drawers: Record<string, boolean>
  
  // Notification state
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    duration?: number
  }>
  
  // Actions
  setSidebarCollapsed: (collapsed: boolean) => void
  setGlobalLoading: (loading: boolean, message?: string) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  openDrawer: (drawerId: string) => void
  closeDrawer: (drawerId: string) => void
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  sidebarCollapsed: false,
  globalLoading: false,
  loadingMessage: '',
  modals: {},
  drawers: {},
  notifications: [],
  
  // Actions
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  setGlobalLoading: (loading, message = '') => set({ 
    globalLoading: loading, 
    loadingMessage: message 
  }),
  
  openModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: true }
  })),
  
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: false }
  })),
  
  openDrawer: (drawerId) => set((state) => ({
    drawers: { ...state.drawers, [drawerId]: true }
  })),
  
  closeDrawer: (drawerId) => set((state) => ({
    drawers: { ...state.drawers, [drawerId]: false }
  })),
  
  addNotification: (notification) => {
    const id = Date.now().toString()
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }))
    
    // Auto remove notification after duration
    const duration = notification.duration || 4500
    setTimeout(() => {
      get().removeNotification(id)
    }, duration)
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] })
}))
// Core data types for FundPilot application

export interface Fund {
  code: string
  name: string
  type: 'mixed' | 'index' | 'bond' | 'stock'
  currentValue: number
  dailyChange: number
  dailyChangePercent: number
  lastUpdate: Date
}

export interface FundDataPoint {
  date: Date
  value: number
  volume?: number
}

export interface TechnicalIndicator {
  type: 'MA' | 'RSI' | 'MACD'
  values: number[]
  dates: Date[]
  parameters: Record<string, any>
}

export interface AIPrediction {
  fundCode: string
  direction: 'up' | 'down' | 'neutral'
  confidence: number // 0-1
  suggestion: 'buy' | 'sell' | 'hold'
  reason: string
  validUntil: Date
}

export interface TradingSignal {
  id: string
  fundCode: string
  fundName: string
  date: Date
  strategyType: string
  signalType: 'buy' | 'sell' | 'hold'
  confidence: number
  recommendation: string
  technicalReason: string
}

export interface MarketIndex {
  name: string
  code: string
  value: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'neutral'
}

export interface UserSettings {
  theme: 'light' | 'dark'
  watchlist: string[] // fund codes
  notifications: NotificationConfig
  apiKeys: Record<string, string>
  dataSync: 'local' | 'cloud'
}

export interface NotificationConfig {
  enabled: boolean
  channels: ('server酱' | 'email' | 'telegram')[]
  frequency: 'daily' | 'weekly' | 'realtime'
  schedule: string // cron format
  credentials: Record<string, string>
}

export interface APIError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

export interface LoadingState {
  isLoading: boolean
  loadingMessage?: string
  progress?: number // 0-100
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'

export interface SignalFilters {
  dateRange: [Date, Date]
  strategyTypes: string[]
  signalTypes: ('buy' | 'sell' | 'hold')[]
  minConfidence: number
}
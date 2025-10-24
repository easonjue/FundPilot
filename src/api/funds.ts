import { apiRequest } from './client'
import type { Fund, FundDataPoint, TechnicalIndicator } from '@/types'

export interface FundSearchParams {
  query?: string
  type?: string
  limit?: number
  offset?: number
}

export interface FundDataParams {
  fundCode: string
  startDate?: string
  endDate?: string
  interval?: '1d' | '1w' | '1m'
}

export interface TechnicalIndicatorParams {
  fundCode: string
  indicators: ('MA' | 'RSI' | 'MACD')[]
  period?: number
  startDate?: string
  endDate?: string
}

// Fund API endpoints
export const fundsAPI = {
  // Get all funds
  getAll: (params?: FundSearchParams): Promise<Fund[]> =>
    apiRequest.get('/funds', { params }),

  // Search funds
  search: (query: string, limit: number = 10): Promise<Fund[]> =>
    apiRequest.get('/funds/search', { params: { query, limit } }),

  // Get fund by code
  getByCode: (code: string): Promise<Fund> =>
    apiRequest.get(`/funds/${code}`),

  // Get fund historical data
  getHistoricalData: (params: FundDataParams): Promise<FundDataPoint[]> =>
    apiRequest.get(`/funds/${params.fundCode}/data`, { 
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        interval: params.interval
      }
    }),

  // Get technical indicators
  getTechnicalIndicators: (params: TechnicalIndicatorParams): Promise<TechnicalIndicator[]> =>
    apiRequest.get(`/funds/${params.fundCode}/indicators`, {
      params: {
        indicators: params.indicators.join(','),
        period: params.period,
        start_date: params.startDate,
        end_date: params.endDate
      }
    }),

  // Get fund performance metrics
  getPerformanceMetrics: (fundCode: string, period: string = '1y'): Promise<{
    returns: number
    volatility: number
    sharpeRatio: number
    maxDrawdown: number
    beta: number
  }> =>
    apiRequest.get(`/funds/${fundCode}/metrics`, { params: { period } }),

  // Add fund to watchlist
  addToWatchlist: (fundCode: string): Promise<void> =>
    apiRequest.post('/funds/watchlist', { fund_code: fundCode }),

  // Remove fund from watchlist
  removeFromWatchlist: (fundCode: string): Promise<void> =>
    apiRequest.delete(`/funds/watchlist/${fundCode}`),

  // Get watchlist
  getWatchlist: (): Promise<Fund[]> =>
    apiRequest.get('/funds/watchlist'),
}

export default fundsAPI
// Export all API modules
export { default as apiClient, apiRequest, checkAPIHealth } from './client'
export { fundsAPI } from './funds'

// Export types
export type { FundSearchParams, FundDataParams, TechnicalIndicatorParams } from './funds'

// Unified API object
export const api = {
  funds: fundsAPI,
}

export default api

// Export all API modules
export { default as apiClient, apiRequest, checkAPIHealth } from './client'
export * from './funds'

// Export types
export type { FundSearchParams, FundDataParams, TechnicalIndicatorParams } from './funds'

// Unified API object - import dynamically to avoid circular dependency
import { fundsAPI } from './funds'

export const api = {
  funds: fundsAPI,
}

export default api

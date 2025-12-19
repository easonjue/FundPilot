import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import type { APIError } from '@/types'

// Extend InternalAxiosRequestConfig to include metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { startTime: number }
}

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const API_TIMEOUT = 10000 // 10 seconds

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token if available
    const token = localStorage.getItem('fundpilot_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp
    ;(config as CustomAxiosRequestConfig).metadata = { startTime: Date.now() }

    return config
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const duration =
      Date.now() -
      ((error.config as CustomAxiosRequestConfig | undefined)?.metadata?.startTime || 0)
    console.error(
      `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`,
      error
    )

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const responseData = error.response.data as any
      const apiError: APIError = {
        code: error.response.status.toString(),
        message: responseData?.message || error.message,
        details: error.response.data,
        timestamp: new Date(),
      }

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('fundpilot_token')
          window.location.href = '/login'
          break
        case 403:
          // Forbidden
          apiError.message = '访问被拒绝，请检查权限'
          break
        case 404:
          // Not found
          apiError.message = '请求的资源不存在'
          break
        case 429:
          // Rate limited
          apiError.message = '请求过于频繁，请稍后再试'
          break
        case 500:
          // Server error
          apiError.message = '服务器内部错误，请稍后再试'
          break
        default:
          apiError.message = responseData?.message || '请求失败'
      }

      return Promise.reject(apiError)
    } else if (error.request) {
      // Network error
      const apiError: APIError = {
        code: 'NETWORK_ERROR',
        message: '网络连接失败，请检查网络设置',
        details: error.request,
        timestamp: new Date(),
      }
      return Promise.reject(apiError)
    } else {
      // Other error
      const apiError: APIError = {
        code: 'UNKNOWN_ERROR',
        message: error.message || '未知错误',
        details: error,
        timestamp: new Date(),
      }
      return Promise.reject(apiError)
    }
  }
)

// Retry logic for failed requests
const retryRequest = async (
  config: CustomAxiosRequestConfig,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<AxiosResponse> => {
  let lastError: any

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await apiClient(config)
    } catch (error) {
      lastError = error

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status
        if (status >= 400 && status < 500 && status !== 429) {
          throw error
        }
      }

      // Don't retry on last attempt
      if (i === maxRetries) {
        throw error
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, i)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError
}

// Enhanced request methods with retry
export const apiRequest = {
  get: <T = any>(url: string, config?: Partial<CustomAxiosRequestConfig>): Promise<T> =>
    retryRequest({ ...config, method: 'GET', url } as CustomAxiosRequestConfig).then(
      response => response.data
    ),

  post: <T = any>(
    url: string,
    data?: any,
    config?: Partial<CustomAxiosRequestConfig>
  ): Promise<T> =>
    retryRequest({ ...config, method: 'POST', url, data } as CustomAxiosRequestConfig).then(
      response => response.data
    ),

  put: <T = any>(url: string, data?: any, config?: Partial<CustomAxiosRequestConfig>): Promise<T> =>
    retryRequest({ ...config, method: 'PUT', url, data } as CustomAxiosRequestConfig).then(
      response => response.data
    ),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: Partial<CustomAxiosRequestConfig>
  ): Promise<T> =>
    retryRequest({ ...config, method: 'PATCH', url, data } as CustomAxiosRequestConfig).then(
      response => response.data
    ),

  delete: <T = any>(url: string, config?: Partial<CustomAxiosRequestConfig>): Promise<T> =>
    retryRequest({ ...config, method: 'DELETE', url } as CustomAxiosRequestConfig).then(
      response => response.data
    ),
}

// Health check function
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    await apiRequest.get('/health')
    return true
  } catch (error) {
    console.error('API health check failed:', error)
    return false
  }
}

export default apiClient

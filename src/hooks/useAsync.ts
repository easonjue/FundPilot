import { useState, useEffect, useCallback, useRef } from 'react'
import type { APIError } from '@/types'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: APIError | Error | null
}

interface UseAsyncOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: APIError | Error) => void
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncOptions = {}
) {
  const { immediate = true, onSuccess, onError } = options
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const mountedRef = useRef(true)
  const lastCallIdRef = useRef(0)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(async () => {
    const callId = ++lastCallIdRef.current

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunction()

      if (mountedRef.current && callId === lastCallIdRef.current) {
        setState({ data, loading: false, error: null })
        onSuccess?.(data)
      }
    } catch (error) {
      if (mountedRef.current && callId === lastCallIdRef.current) {
        const apiError = error as APIError | Error
        setState(prev => ({ ...prev, loading: false, error: apiError }))
        onError?.(apiError)
      }
    }
  }, deps)

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

export default useAsync

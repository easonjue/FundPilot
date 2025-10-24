import { useState, useEffect, useCallback, useRef } from 'react'

interface UseRealTimeDataOptions {
  interval?: number // Update interval in milliseconds
  enabled?: boolean // Whether auto-refresh is enabled
  onUpdate?: () => void // Callback when data updates
  marketHoursOnly?: boolean // Only update during market hours
}

interface MarketHours {
  start: number // Hour (0-23)
  end: number // Hour (0-23)
  days: number[] // Days of week (0=Sunday, 1=Monday, etc.)
}

const DEFAULT_MARKET_HOURS: MarketHours = {
  start: 9, // 9 AM
  end: 15, // 3 PM
  days: [1, 2, 3, 4, 5] // Monday to Friday
}

export function useRealTimeData(options: UseRealTimeDataOptions = {}) {
  const {
    interval = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
    onUpdate,
    marketHoursOnly = true
  } = options

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)
  const [nextUpdate, setNextUpdate] = useState<Date | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const enabledRef = useRef(enabled)

  // Check if current time is within market hours
  const isMarketHours = useCallback(() => {
    if (!marketHoursOnly) return true
    
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay()
    
    return (
      DEFAULT_MARKET_HOURS.days.includes(currentDay) &&
      currentHour >= DEFAULT_MARKET_HOURS.start &&
      currentHour < DEFAULT_MARKET_HOURS.end
    )
  }, [marketHoursOnly])

  // Calculate next update time
  const calculateNextUpdate = useCallback(() => {
    const now = new Date()
    const next = new Date(now.getTime() + interval)
    return next
  }, [interval])

  // Manual refresh function
  const refresh = useCallback(async () => {
    setIsUpdating(true)
    setLastUpdate(new Date())
    
    try {
      await onUpdate?.()
    } catch (error) {
      console.error('Error during data refresh:', error)
    } finally {
      setIsUpdating(false)
      setNextUpdate(calculateNextUpdate())
    }
  }, [onUpdate, calculateNextUpdate])

  // Start/stop auto-refresh
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const updateIfNeeded = () => {
      if (enabledRef.current && isMarketHours()) {
        refresh()
      } else {
        // Still update the next update time even if not refreshing
        setNextUpdate(calculateNextUpdate())
      }
    }

    // Initial update
    if (enabled && isMarketHours()) {
      refresh()
    } else {
      setNextUpdate(calculateNextUpdate())
    }

    // Set up interval
    intervalRef.current = setInterval(updateIfNeeded, interval)
  }, [enabled, refresh, isMarketHours, interval, calculateNextUpdate])

  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setNextUpdate(null)
  }, [])

  // Update enabled ref when prop changes
  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  // Start/stop auto-refresh based on enabled state
  useEffect(() => {
    if (enabled) {
      startAutoRefresh()
    } else {
      stopAutoRefresh()
    }

    return () => {
      stopAutoRefresh()
    }
  }, [enabled, startAutoRefresh, stopAutoRefresh])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    lastUpdate,
    nextUpdate,
    isUpdating,
    isMarketHours: isMarketHours(),
    refresh,
    startAutoRefresh,
    stopAutoRefresh
  }
}

export default useRealTimeData
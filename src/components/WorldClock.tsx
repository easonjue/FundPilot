import React, { useState, useEffect } from 'react'
import { Typography, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import styles from './WorldClock.module.less'

const { Text } = Typography

interface TimeZoneInfo {
  city: string
  timezone: string
  market: string
  flag: string
  marketHours: {
    open: string
    close: string
  }
}

const timeZones: TimeZoneInfo[] = [
  {
    city: 'Shanghai',
    timezone: 'Asia/Shanghai',
    market: 'SSE/SZSE',
    flag: '🇨🇳',
    marketHours: { open: '09:30', close: '15:00' }
  },
  {
    city: 'Hong Kong',
    timezone: 'Asia/Hong_Kong',
    market: 'HKEX',
    flag: '🇭🇰',
    marketHours: { open: '09:30', close: '16:00' }
  },
  {
    city: 'Tokyo',
    timezone: 'Asia/Tokyo',
    market: 'TSE',
    flag: '🇯🇵',
    marketHours: { open: '09:00', close: '15:00' }
  },
  {
    city: 'New York',
    timezone: 'America/New_York',
    market: 'NYSE/NASDAQ',
    flag: '🇺🇸',
    marketHours: { open: '09:30', close: '16:00' }
  },
  {
    city: 'London',
    timezone: 'Europe/London',
    market: 'LSE',
    flag: '🇬🇧',
    marketHours: { open: '08:00', close: '16:30' }
  },
  {
    city: 'Frankfurt',
    timezone: 'Europe/Berlin',
    market: 'XETRA',
    flag: '🇩🇪',
    marketHours: { open: '09:00', close: '17:30' }
  }
]

interface WorldClockProps {
  compact?: boolean
}

const WorldClock: React.FC<WorldClockProps> = ({ compact = false }) => {
  const { t } = useTranslation()
  const [times, setTimes] = useState<Record<string, Date>>({})

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: Record<string, Date> = {}
      timeZones.forEach(tz => {
        newTimes[tz.timezone] = new Date()
      })
      setTimes(newTimes)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date)
  }

  const formatDate = (date: Date, timezone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const isMarketOpen = (timezone: string, marketHours: { open: string; close: string }) => {
    const now = new Date()
    const timeStr = formatTime(now, timezone)
    const [hours, minutes] = timeStr.split(':').map(Number)
    const currentMinutes = hours * 60 + minutes
    
    const [openHours, openMins] = marketHours.open.split(':').map(Number)
    const [closeHours, closeMins] = marketHours.close.split(':').map(Number)
    const openMinutes = openHours * 60 + openMins
    const closeMinutes = closeHours * 60 + closeMins
    
    // 检查是否为工作日（简化版本）
    const dayOfWeek = new Date().getDay()
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
    
    return isWeekday && currentMinutes >= openMinutes && currentMinutes <= closeMinutes
  }

  if (compact) {
    return (
      <div className={styles.compactClock}>
        <Space size="large">
          {timeZones.slice(0, 4).map((tz) => (
            <div key={tz.timezone} className={styles.compactTimeItem}>
              <span className={styles.flag}>{tz.flag}</span>
              <span className={styles.time}>
                {times[tz.timezone] && formatTime(times[tz.timezone], tz.timezone)}
              </span>
              <div className={`${styles.marketStatus} ${isMarketOpen(tz.timezone, tz.marketHours) ? styles.open : styles.closed}`}>
                {isMarketOpen(tz.timezone, tz.marketHours) ? '●' : '○'}
              </div>
            </div>
          ))}
        </Space>
      </div>
    )
  }

  return (
    <div className={styles.worldClock}>
      <div className={styles.clockGrid}>
        {timeZones.map((tz) => {
          const isOpen = isMarketOpen(tz.timezone, tz.marketHours)
          return (
            <div key={tz.timezone} className={`${styles.clockItem} ${isOpen ? styles.marketOpen : styles.marketClosed}`}>
              <div className={styles.clockHeader}>
                <span className={styles.flag}>{tz.flag}</span>
                <div className={styles.cityInfo}>
                  <Text className={styles.cityName}>{tz.city}</Text>
                  <Text className={styles.marketName}>{tz.market}</Text>
                </div>
                <div className={`${styles.statusDot} ${isOpen ? styles.open : styles.closed}`}></div>
              </div>
              
              <div className={styles.timeDisplay}>
                <Text className={styles.time}>
                  {times[tz.timezone] && formatTime(times[tz.timezone], tz.timezone)}
                </Text>
                <Text className={styles.date}>
                  {times[tz.timezone] && formatDate(times[tz.timezone], tz.timezone)}
                </Text>
              </div>
              
              <div className={styles.marketInfo}>
                <Text className={styles.marketHours}>
                  {tz.marketHours.open} - {tz.marketHours.close}
                </Text>
                <Text className={`${styles.marketStatus} ${isOpen ? styles.open : styles.closed}`}>
                  {isOpen ? t('market.trading') : t('market.closed')}
                </Text>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WorldClock
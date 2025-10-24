import React, { useState, useEffect } from 'react'
import { Typography, Space } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useI18n } from '@/hooks/useI18n'
import { newsService, type MarketData, type NewsItem } from '@/services/newsService'
import styles from './MarketTicker.module.less'

const { Text } = Typography

interface MarketTickerProps {
  height?: number
  speed?: number
  showNews?: boolean
}

const MarketTicker: React.FC<MarketTickerProps> = ({ 
  height = 60, 
  speed = 50,
  showNews = true 
}) => {
  const { t } = useTranslation()
  const { formatNumber, formatPercent, formatTime } = useI18n()
  
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [markets, news] = await Promise.all([
          newsService.getMarketData(),
          newsService.getRealtimeNews(10)
        ])
        setMarketData(markets)
        setNewsData(news)
      } catch (error) {
        console.error('Failed to load ticker data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // 定期更新数据
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [markets, news] = await Promise.all([
          newsService.getMarketData(),
          newsService.getRealtimeNews(10)
        ])
        setMarketData(markets)
        setNewsData(news)
      } catch (error) {
        console.error('Failed to update ticker data:', error)
      }
    }, 30000) // 每30秒更新一次

    return () => clearInterval(interval)
  }, [])

  const renderMarketItem = (item: MarketData, index: number) => {
    const isPositive = item.change >= 0
    const changeColor = isPositive ? '#10b981' : '#ef4444'
    
    return (
      <div key={`${item.symbol}-${index}`} className={styles.tickerItem}>
        <div className={styles.symbolInfo}>
          <Text className={styles.symbol}>{item.symbol}</Text>
          <Text className={styles.name}>{item.name}</Text>
        </div>
        <div className={styles.priceInfo}>
          <Text className={styles.price}>{formatNumber(item.price)}</Text>
          <div className={styles.changeInfo} style={{ color: changeColor }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <Text style={{ color: changeColor }}>
              {isPositive ? '+' : ''}{formatNumber(item.change)}
            </Text>
            <Text style={{ color: changeColor }}>
              ({isPositive ? '+' : ''}{formatPercent(item.changePercent)})
            </Text>
          </div>
        </div>
      </div>
    )
  }

  const renderNewsItem = (item: NewsItem, index: number) => {
    const impactColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981'
    }

    const publishTime = new Date(item.publishTime)
    const timeStr = formatTime(publishTime, { hour: '2-digit', minute: '2-digit' })

    return (
      <div key={`${item.id}-${index}`} className={styles.newsItem}>
        <div className={styles.newsHeader}>
          <span 
            className={styles.impactDot} 
            style={{ backgroundColor: impactColors[item.impact] }}
          ></span>
          <Text className={styles.newsTime}>{timeStr}</Text>
          <Text className={styles.newsCategory}>{item.category}</Text>
        </div>
        <div className={styles.newsContent}>
          <Text className={styles.newsTitle}>{item.title}</Text>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.marketTicker} style={{ height }}>
        <div className={styles.loadingContainer}>
          <Text className={styles.loadingText}>{t('common.loading')}</Text>
        </div>
      </div>
    )
  }

  // 创建混合的数据流
  const createMixedContent = () => {
    const marketItems = marketData.map((item, index) => ({ 
      type: 'market' as const, 
      data: item, 
      key: `market-${index}` 
    }))
    
    const newsItems = showNews ? newsData.map((item, index) => ({ 
      type: 'news' as const, 
      data: item, 
      key: `news-${index}` 
    })) : []
    
    // 按照 2:1 的比例混合市场数据和新闻
    const mixed = []
    let marketIndex = 0
    let newsIndex = 0
    
    while (marketIndex < marketItems.length || newsIndex < newsItems.length) {
      // 添加2个市场数据
      if (marketIndex < marketItems.length) {
        mixed.push(marketItems[marketIndex++])
      }
      if (marketIndex < marketItems.length) {
        mixed.push(marketItems[marketIndex++])
      }
      
      // 添加1个新闻
      if (newsIndex < newsItems.length) {
        mixed.push(newsItems[newsIndex++])
      }
    }
    
    // 重复内容以实现无缝滚动
    return [...mixed, ...mixed, ...mixed]
  }

  const mixedContent = createMixedContent()

  return (
    <div className={styles.marketTicker} style={{ height }}>
      <div className={styles.tickerContainer}>
        <div 
          className={styles.tickerContent}
          style={{ 
            animationDuration: `${Math.max(mixedContent.length * 1.5, 45)}s`
          }}
        >
          {mixedContent.map((item, index) => 
            item.type === 'market' 
              ? renderMarketItem(item.data as MarketData, index)
              : renderNewsItem(item.data as NewsItem, index)
          )}
        </div>
      </div>

      {/* 渐变遮罩 */}
      <div className={styles.fadeLeft}></div>
      <div className={styles.fadeRight}></div>
    </div>
  )
}

export default MarketTicker
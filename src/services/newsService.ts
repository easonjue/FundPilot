// 新闻数据服务
export interface NewsItem {
  id: string
  title: string
  summary?: string
  content?: string
  publishTime: string
  source: string
  category: string
  impact: 'high' | 'medium' | 'low'
  tags: string[]
  url?: string
  imageUrl?: string
}

export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  market: string
  currency: string
  lastUpdate: string
}

class NewsService {
  private baseUrl = ''
  private apiKey = ''

  /**
   * 获取实时新闻
   */
  async getRealtimeNews(limit: number = 20): Promise<NewsItem[]> {
    try {
      // 如果有真实API，使用真实数据
      if (this.baseUrl && this.apiKey) {
        const response = await fetch(`${this.baseUrl}/news?limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        return await response.json()
      }

      // 否则返回模拟数据
      return this.getMockNews()
    } catch (error) {
      console.error('Error fetching news:', error)
      return this.getMockNews()
    }
  }

  /**
   * 获取市场数据
   */
  async getMarketData(): Promise<MarketData[]> {
    try {
      // 如果有真实API，使用真实数据
      if (this.baseUrl && this.apiKey) {
        const response = await fetch(`${this.baseUrl}/market`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }

        return await response.json()
      }

      // 否则返回模拟数据
      return this.getMockMarketData()
    } catch (error) {
      console.error('Error fetching market data:', error)
      return this.getMockMarketData()
    }
  }

  /**
   * 根据关键词搜索新闻
   */
  async searchNews(keyword: string, limit: number = 10): Promise<NewsItem[]> {
    try {
      if (this.baseUrl && this.apiKey) {
        const response = await fetch(
          `${this.baseUrl}/news/search?q=${encodeURIComponent(keyword)}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to search news')
        }

        return await response.json()
      }

      // 模拟搜索
      const allNews = this.getMockNews()
      return allNews
        .filter(
          news =>
            news.title.toLowerCase().includes(keyword.toLowerCase()) ||
            news.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
        )
        .slice(0, limit)
    } catch (error) {
      console.error('Error searching news:', error)
      return []
    }
  }

  /**
   * 获取模拟新闻数据
   */
  private getMockNews(): NewsItem[] {
    const now = new Date()
    return [
      {
        id: '1',
        title: '央行宣布降准0.25个百分点，释放流动性约5000亿元',
        summary: '中国人民银行决定于2024年1月15日下调金融机构存款准备金率0.25个百分点',
        publishTime: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
        source: '央行官网',
        category: '货币政策',
        impact: 'high',
        tags: ['央行', '降准', '流动性', '货币政策'],
      },
      {
        id: '2',
        title: '美联储官员暗示可能暂停加息，市场情绪转暖',
        summary: '美联储理事鲍威尔在最新讲话中表示，考虑到通胀数据的改善，可能会暂停进一步加息',
        publishTime: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
        source: 'Reuters',
        category: '国际市场',
        impact: 'high',
        tags: ['美联储', '加息', '通胀', '货币政策'],
      },
      {
        id: '3',
        title: '科技股集体上涨，AI概念股领涨',
        summary: 'ChatGPT概念股、算力概念股等AI相关板块今日表现强势',
        publishTime: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        source: '财经网',
        category: '行业动态',
        impact: 'medium',
        tags: ['科技股', 'AI', '人工智能', '概念股'],
      },
      {
        id: '4',
        title: '新能源汽车销量创新高，相关产业链受益',
        summary: '2024年1月新能源汽车销量同比增长35%，产业链上下游企业业绩预期向好',
        publishTime: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
        source: '汽车之家',
        category: '行业动态',
        impact: 'medium',
        tags: ['新能源汽车', '销量', '产业链', '电池'],
      },
      {
        id: '5',
        title: '国际油价上涨2%，能源板块表现活跃',
        summary: '受地缘政治因素影响，国际原油价格今日上涨2%，能源类股票普遍上涨',
        publishTime: new Date(now.getTime() - 120 * 60 * 1000).toISOString(),
        source: 'Bloomberg',
        category: '大宗商品',
        impact: 'medium',
        tags: ['原油', '能源', '地缘政治', '大宗商品'],
      },
      {
        id: '6',
        title: '房地产政策进一步优化，地产股午后拉升',
        summary: '多个城市出台房地产支持政策，地产板块午后集体拉升',
        publishTime: new Date(now.getTime() - 150 * 60 * 1000).toISOString(),
        source: '21世纪经济报道',
        category: '政策解读',
        impact: 'low',
        tags: ['房地产', '政策', '地产股', '楼市'],
      },
      {
        id: '7',
        title: '北向资金净流入50亿元，外资持续看好A股',
        summary: '今日北向资金净流入50.2亿元，连续5个交易日净流入',
        publishTime: new Date(now.getTime() - 180 * 60 * 1000).toISOString(),
        source: 'Wind资讯',
        category: '资金流向',
        impact: 'medium',
        tags: ['北向资金', '外资', 'A股', '资金流入'],
      },
      {
        id: '8',
        title: '创业板指涨超2%，成长股表现强势',
        summary: '创业板指数今日涨幅超过2%，医药、科技等成长股表现亮眼',
        publishTime: new Date(now.getTime() - 210 * 60 * 1000).toISOString(),
        source: '同花顺',
        category: '市场动态',
        impact: 'medium',
        tags: ['创业板', '成长股', '医药', '科技股'],
      },
    ]
  }

  /**
   * 获取模拟市场数据
   */
  private getMockMarketData(): MarketData[] {
    const now = new Date().toISOString()
    const baseData = [
      {
        symbol: 'SSE',
        name: '上证指数',
        price: 3245.67,
        change: 15.23,
        changePercent: 0.47,
        market: 'CN',
        currency: 'CNY',
      },
      {
        symbol: 'SZSE',
        name: '深证成指',
        price: 12456.78,
        change: -23.45,
        changePercent: -0.19,
        market: 'CN',
        currency: 'CNY',
      },
      {
        symbol: 'CSI300',
        name: '沪深300',
        price: 4123.45,
        change: 8.9,
        changePercent: 0.22,
        market: 'CN',
        currency: 'CNY',
      },
      {
        symbol: 'HSI',
        name: '恒生指数',
        price: 18234.56,
        change: 145.67,
        changePercent: 0.81,
        market: 'HK',
        currency: 'HKD',
      },
      {
        symbol: 'N225',
        name: '日经225',
        price: 32456.78,
        change: -89.12,
        changePercent: -0.27,
        market: 'JP',
        currency: 'JPY',
      },
      {
        symbol: 'SPX',
        name: 'S&P 500',
        price: 4567.89,
        change: 23.45,
        changePercent: 0.52,
        market: 'US',
        currency: 'USD',
      },
      {
        symbol: 'DJI',
        name: '道琼斯',
        price: 34567.12,
        change: 156.78,
        changePercent: 0.46,
        market: 'US',
        currency: 'USD',
      },
      {
        symbol: 'IXIC',
        name: '纳斯达克',
        price: 14234.56,
        change: -45.67,
        changePercent: -0.32,
        market: 'US',
        currency: 'USD',
      },
      {
        symbol: 'UKX',
        name: '富时100',
        price: 7654.32,
        change: 12.34,
        changePercent: 0.16,
        market: 'UK',
        currency: 'GBP',
      },
      {
        symbol: 'DAX',
        name: '德国DAX',
        price: 15678.9,
        change: 67.89,
        changePercent: 0.44,
        market: 'DE',
        currency: 'EUR',
      },
    ]

    // 添加随机波动
    return baseData.map(item => ({
      ...item,
      price: item.price + (Math.random() - 0.5) * 20,
      change: item.change + (Math.random() - 0.5) * 5,
      changePercent: item.changePercent + (Math.random() - 0.5) * 0.2,
      volume: Math.floor(Math.random() * 1000000000),
      lastUpdate: now,
    }))
  }
}

// 导出单例实例
export const newsService = new NewsService()
export default newsService

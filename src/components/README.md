# FundPilot 组件文档

## 新增组件

### 🌍 WorldClock - 世界时钟组件

显示全球主要金融市场的实时时间和交易状态。

**功能特性:**

- 实时显示6个主要金融中心时间
- 市场开盘/闭盘状态指示
- 支持紧凑模式和完整模式
- 自动检测交易时间
- 响应式设计

**支持的市场:**

- 🇨🇳 上海/深圳 (SSE/SZSE) - 09:30-15:00
- 🇭🇰 香港 (HKEX) - 09:30-16:00
- 🇯🇵 东京 (TSE) - 09:00-15:00
- 🇺🇸 纽约 (NYSE/NASDAQ) - 09:30-16:00
- 🇬🇧 伦敦 (LSE) - 08:00-16:30
- 🇩🇪 法兰克福 (XETRA) - 09:00-17:30

**使用方法:**

```tsx
// 紧凑模式（用于顶部状态栏）
<WorldClock compact />

// 完整模式（用于独立展示）
<WorldClock />
```

### 📈 MarketTicker - 市场滚动条组件

底部滚动显示实时市场数据和重要新闻。

**功能特性:**

- 实时市场指数数据滚动
- 重要财经新闻滚动
- 支持双层滚动显示
- 自动数据更新
- 悬停暂停功能
- 渐变边缘遮罩效果

**数据源:**

- 主要股指：上证、深证、恒指、日经、标普、道指、纳指等
- 财经新闻：央行政策、市场动态、行业资讯等
- 支持真实API接入和模拟数据

**使用方法:**

```tsx
<MarketTicker
  height={80} // 高度
  speed={60} // 滚动速度
  showNews={true} // 是否显示新闻
/>
```

### 📰 NewsService - 新闻数据服务

提供新闻和市场数据的统一接口。

**功能特性:**

- 实时新闻获取
- 市场数据获取
- 新闻搜索功能
- 自动降级到模拟数据
- 支持多种数据源

**API接口:**

```typescript
// 获取实时新闻
const news = await newsService.getRealtimeNews(20)

// 获取市场数据
const markets = await newsService.getMarketData()

// 搜索新闻
const results = await newsService.searchNews('央行')
```

## 集成说明

### 在DesktopCockpit中的集成

1. **顶部状态栏** - 集成WorldClock紧凑模式
2. **底部滚动条** - 集成MarketTicker组件
3. **数据服务** - 使用NewsService获取实时数据

### 样式系统

所有组件都使用统一的设计令牌系统：

- CSS变量定义颜色、字体、间距
- 支持亮色/暗色主题切换
- 响应式断点适配
- 动画和过渡效果

### 国际化支持

组件完全支持多语言：

- 时间格式本地化
- 市场状态翻译
- 新闻分类翻译
- 数字格式化

## 配置说明

### 环境变量

创建 `.env` 文件配置API：

```bash
# 新闻API
VITE_NEWS_API_URL=https://api.example.com/v1
VITE_NEWS_API_KEY=your_api_key

# 功能开关
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_REAL_TIME_UPDATE=true
```

### 真实API接入

1. **新闻API** - 支持标准REST API
2. **市场数据API** - 支持WebSocket实时推送
3. **认证方式** - Bearer Token或API Key

### 模拟数据

开发环境下自动使用模拟数据：

- 实时更新的市场指数
- 模拟的财经新闻
- 随机的价格波动

## 性能优化

### 数据更新策略

- 市场数据：每30秒更新
- 新闻数据：每5分钟更新
- 时钟显示：每秒更新

### 内存管理

- 自动清理定时器
- 组件卸载时停止数据请求
- 合理的数据缓存策略

### 动画优化

- 使用CSS动画而非JS动画
- 支持用户减少动画偏好
- GPU加速的transform动画

## 扩展指南

### 添加新的市场

在WorldClock组件中添加新的时区配置：

```typescript
{
  city: 'Sydney',
  timezone: 'Australia/Sydney',
  market: 'ASX',
  flag: '🇦🇺',
  marketHours: { open: '10:00', close: '16:00' }
}
```

### 自定义新闻源

实现NewsService的子类：

```typescript
class CustomNewsService extends NewsService {
  async getRealtimeNews() {
    // 自定义实现
  }
}
```

### 添加新的数据类型

扩展MarketData接口：

```typescript
interface ExtendedMarketData extends MarketData {
  sector: string
  marketCap: number
  pe: number
}
```

这些组件让FundPilot真正成为了一个专业的金融信息中心，为用户提供全球视野的实时市场信息！

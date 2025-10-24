# FundPilot 国际化系统

## 概述

FundPilot 支持多语言国际化，目前支持以下语言：

- 🇨🇳 简体中文 (zh-CN) - 默认语言
- 🇺🇸 English (en-US)
- 🇯🇵 日本語 (ja-JP)

## 功能特性

### 🌍 多语言支持
- 自动检测浏览器语言
- 支持手动切换语言
- 语言设置持久化存储
- 实时语言切换，无需刷新页面

### 📊 本地化格式化
- 数字格式化（千分位分隔符）
- 货币格式化（支持不同货币符号）
- 百分比格式化
- 日期时间格式化
- 相对时间显示（如：2小时前）

### 🎨 UI组件国际化
- Ant Design 组件语言包集成
- 自定义组件完全国际化
- 响应式语言切换器
- 主题与语言联动

## 使用方法

### 基础翻译

```tsx
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('navigation.dashboard')}</h1>
      <p>{t('common.loading')}</p>
    </div>
  )
}
```

### 使用自定义Hook

```tsx
import { useI18n } from '@/hooks/useI18n'

const MyComponent = () => {
  const { 
    t, 
    formatCurrency, 
    formatPercent, 
    formatDate,
    currentLanguage 
  } = useI18n()
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>价格: {formatCurrency(1234.56)}</p>
      <p>涨幅: {formatPercent(5.67)}</p>
      <p>日期: {formatDate(new Date())}</p>
      <p>当前语言: {currentLanguage}</p>
    </div>
  )
}
```

### 语言切换器

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher'

const Header = () => {
  return (
    <div>
      <LanguageSwitcher 
        showText={true} 
        size="large" 
        placement="bottomRight" 
      />
    </div>
  )
}
```

### 程序化语言切换

```tsx
import { useLanguageStore } from '@/stores/languageStore'

const Settings = () => {
  const { setLanguage } = useLanguageStore()
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang) // 'zh-CN' | 'en-US' | 'ja-JP'
  }
  
  return (
    <select onChange={(e) => handleLanguageChange(e.target.value)}>
      <option value="zh-CN">简体中文</option>
      <option value="en-US">English</option>
      <option value="ja-JP">日本語</option>
    </select>
  )
}
```

## 翻译键命名规范

### 命名空间结构
```
common.*          - 通用词汇（按钮、状态等）
navigation.*      - 导航相关
layout.*          - 布局组件相关
greeting.*        - 问候语
market.*          - 市场相关
theme.*           - 主题相关
language.*        - 语言相关
dashboard.*       - 仪表盘模块
analysis.*        - 分析模块
strategy.*        - 策略模块
notifications.*   - 通知模块
ai.*              - AI相关
fund.*            - 基金相关
error.*           - 错误信息
success.*         - 成功信息
time.*            - 时间相关
```

### 命名约定
- 使用小驼峰命名法
- 按功能模块分组
- 保持键名简洁明了
- 避免过深的嵌套层级

## 添加新语言

### 1. 创建语言文件
在 `src/i18n/locales/` 目录下创建新的语言文件，如 `fr-FR.json`

### 2. 更新语言配置
在 `src/i18n/index.ts` 中添加新语言：

```typescript
import frFR from './locales/fr-FR.json'

export const supportedLanguages = [
  // ... 现有语言
  { code: 'fr-FR', name: 'French', nativeName: 'Français' }
] as const

const resources = {
  // ... 现有资源
  'fr-FR': { translation: frFR }
}
```

### 3. 添加Ant Design语言包
在 `src/App.tsx` 中导入并配置：

```typescript
import frFR from 'antd/locale/fr_FR'

const getAntdLocale = () => {
  switch (currentLanguage) {
    // ... 现有语言
    case 'fr-FR':
      return frFR
    default:
      return zhCN
  }
}
```

## 最佳实践

### 1. 翻译文本
- 避免在翻译中硬编码数字和日期
- 使用插值变量处理动态内容
- 考虑不同语言的文本长度差异
- 为专业术语提供准确翻译

### 2. 格式化
- 使用内置的格式化函数处理数字、货币、日期
- 考虑不同地区的格式习惯
- 为金融数据使用合适的精度

### 3. 性能优化
- 语言包按需加载
- 避免在渲染循环中调用翻译函数
- 使用React.memo优化翻译组件

### 4. 测试
- 测试所有支持语言的界面显示
- 验证格式化函数的输出
- 检查文本溢出和布局问题

## 文件结构

```
src/i18n/
├── index.ts                 # 国际化配置入口
├── locales/
│   ├── zh-CN.json          # 中文翻译
│   ├── en-US.json          # 英文翻译
│   └── ja-JP.json          # 日文翻译
└── README.md               # 说明文档

src/stores/
└── languageStore.ts        # 语言状态管理

src/hooks/
└── useI18n.ts             # 国际化Hook

src/components/
├── LanguageSwitcher.tsx    # 语言切换器
└── LanguageProvider.tsx    # 语言提供者
```

## 技术栈

- **i18next**: 国际化框架
- **react-i18next**: React集成
- **i18next-browser-languagedetector**: 浏览器语言检测
- **Zustand**: 语言状态管理
- **Intl API**: 原生格式化API

## 贡献指南

### 添加翻译
1. 在对应语言文件中添加翻译键值对
2. 确保所有支持语言都有对应翻译
3. 测试翻译在实际界面中的显示效果

### 报告问题
- 翻译错误或不准确
- 格式化问题
- 布局适配问题
- 性能问题

欢迎提交 Issue 和 Pull Request！
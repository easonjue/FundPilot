import { Card, Space, Typography, Divider } from 'antd'
import React from 'react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useI18n } from '@/hooks/useI18n'

const { Title, Text, Paragraph } = Typography

const I18nDemo: React.FC = () => {
  const {
    t,
    formatNumber,
    formatCurrency,
    formatPercent,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
    currentLanguage,
  } = useI18n()

  const demoData = {
    number: 1234567.89,
    currency: 1234567.89,
    percent: 15.67,
    date: new Date(),
    pastDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>{t('language.switchLanguage')}</Title>
        <LanguageSwitcher showText size="large" />
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {/* 基础翻译演示 */}
        <Card title={t('common.info')} className="w-full">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>{t('language.chinese')}: </Text>
              <Text>{t('navigation.dashboard')}</Text>
            </div>
            <div>
              <Text strong>{t('language.english')}: </Text>
              <Text>Command Center</Text>
            </div>
            <div>
              <Text strong>{t('language.japanese')}: </Text>
              <Text>コマンドセンター</Text>
            </div>
          </Space>
        </Card>

        {/* 数字格式化演示 */}
        <Card title={t('common.preview')} className="w-full">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>数字格式化: </Text>
              <Text code>{formatNumber(demoData.number)}</Text>
            </div>
            <div>
              <Text strong>货币格式化: </Text>
              <Text code>{formatCurrency(demoData.currency)}</Text>
            </div>
            <div>
              <Text strong>百分比格式化: </Text>
              <Text code>{formatPercent(demoData.percent)}</Text>
            </div>
          </Space>
        </Card>

        {/* 日期时间格式化演示 */}
        <Card title={t('time.updatedAt')} className="w-full">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text strong>日期: </Text>
              <Text code>{formatDate(demoData.date)}</Text>
            </div>
            <div>
              <Text strong>时间: </Text>
              <Text code>{formatTime(demoData.date)}</Text>
            </div>
            <div>
              <Text strong>日期时间: </Text>
              <Text code>{formatDateTime(demoData.date)}</Text>
            </div>
            <div>
              <Text strong>相对时间: </Text>
              <Text code>{formatRelativeTime(demoData.pastDate)}</Text>
            </div>
          </Space>
        </Card>

        {/* 界面元素翻译演示 */}
        <Card title={t('navigation.navigationCenter')} className="w-full">
          <Space direction="vertical" size="middle" className="w-full">
            <Paragraph>
              <Text strong>{t('layout.systemOnline')}: </Text>
              <Text type="success">✓</Text>
            </Paragraph>
            <Paragraph>
              <Text strong>{t('layout.dataSync')}: </Text>
              <Text type="success">✓</Text>
            </Paragraph>
            <Divider />
            <Paragraph>
              <Text strong>{t('layout.marketStatus')}:</Text>
            </Paragraph>
            <ul>
              <li>
                {t('market.shanghaiShenzhen300')} - {t('market.open')}
              </li>
              <li>
                {t('market.hongKongStock')} - {t('market.suspended')}
              </li>
              <li>
                {t('market.usStock')} - {t('market.closed')}
              </li>
            </ul>
          </Space>
        </Card>

        {/* AI助手翻译演示 */}
        <Card title={t('ai.assistant')} className="w-full">
          <Paragraph>
            {t('ai.riskWarning')}，{t('ai.suggestedActions')}。
          </Paragraph>
          <Paragraph>
            <Text strong>{t('ai.confidenceLevel')}: </Text>
            <Text code>85%</Text>
          </Paragraph>
        </Card>

        {/* 当前语言信息 */}
        <Card title="Debug Info" className="w-full">
          <Paragraph>
            <Text strong>Current Language: </Text>
            <Text code>{currentLanguage}</Text>
          </Paragraph>
        </Card>
      </Space>
    </div>
  )
}

export default I18nDemo

import { FundOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Typography, Button, List, Avatar, Tag, Tooltip, Empty } from 'antd'
import React, { useState } from 'react'
import FundSearchInput from './FundSearchInput'
import type { Fund } from '@/types'

const { Title, Text } = Typography

interface FundSelectionPanelProps {
  allFunds: Fund[]
  selectedFund: Fund | null
  watchlist: string[]
  onFundSelect: (fund: Fund) => void
  onAddToWatchlist: (fundCode: string) => void
  onRemoveFromWatchlist: (fundCode: string) => void
  className?: string
}

const FundSelectionPanel: React.FC<FundSelectionPanelProps> = ({
  allFunds,
  selectedFund,
  watchlist,
  onFundSelect,
  _onAddToWatchlist,
  onRemoveFromWatchlist,
  className = '',
}) => {
  const [showSearch, setShowSearch] = useState(false)

  // Get watchlist funds
  const watchlistFunds = allFunds.filter(fund => watchlist.includes(fund.code))

  // Get fund type display info
  const getFundTypeInfo = (type: Fund['type']) => {
    switch (type) {
      case 'mixed':
        return { label: '混合', color: 'blue' }
      case 'stock':
        return { label: '股票', color: 'red' }
      case 'bond':
        return { label: '债券', color: 'green' }
      case 'index':
        return { label: '指数', color: 'orange' }
      default:
        return { label: '其他', color: 'default' }
    }
  }

  // Format change with color
  const formatChange = (change: number, changePercent: number) => {
    const color = change >= 0 ? '#52c41a' : '#ff4d4f'
    const sign = change >= 0 ? '+' : ''
    return (
      <div style={{ color }}>
        <div className="text-sm font-medium">
          {sign}
          {change.toFixed(4)}
        </div>
        <div className="text-xs">
          ({sign}
          {changePercent.toFixed(2)}%)
        </div>
      </div>
    )
  }

  const handleFundSelect = (fund: Fund) => {
    onFundSelect(fund)
    setShowSearch(false)
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Title level={4} className="mb-0 text-gray-900 dark:text-gray-100">
              基金选择
            </Title>
            <Text className="text-gray-500 dark:text-gray-400 text-sm">搜索并管理您的关注基金</Text>
          </div>
          <Button
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            onClick={() => setShowSearch(!showSearch)}
            className="shadow-sm"
          >
            {showSearch ? '取消' : '添加基金'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Search Input */}
          {showSearch && (
            <div>
              <FundSearchInput
                funds={allFunds}
                onFundSelect={handleFundSelect}
                placeholder="搜索基金名称或代码"
                size="middle"
              />
            </div>
          )}

          {/* Selected Fund */}
          {selectedFund && (
            <div>
              <Text className="text-sm text-gray-500 mb-2 block">当前选择</Text>
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar size="small" icon={<FundOutlined />} className="bg-primary-500" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <Text className="font-medium">{selectedFund.name}</Text>
                        <Tag color={getFundTypeInfo(selectedFund.type).color}>
                          {getFundTypeInfo(selectedFund.type).label}
                        </Tag>
                      </div>
                      <Text className="text-xs text-gray-500">{selectedFund.code}</Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {selectedFund.currentValue.toFixed(4)}
                    </div>
                    {formatChange(selectedFund.dailyChange, selectedFund.dailyChangePercent)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Watchlist */}
          <div>
            <Text className="text-sm text-gray-500 mb-2 block">
              关注列表 ({watchlistFunds.length})
            </Text>

            {watchlistFunds.length === 0 ? (
              <Empty
                image={<FundOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />}
                description="暂无关注的基金"
                className="py-4"
              />
            ) : (
              <List
                size="small"
                dataSource={watchlistFunds}
                renderItem={fund => (
                  <List.Item
                    className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 ${
                      selectedFund?.code === fund.code ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    onClick={() => onFundSelect(fund)}
                    actions={[
                      <Tooltip title="移除关注" key="remove">
                        <Button
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          onClick={e => {
                            e.stopPropagation()
                            onRemoveFromWatchlist(fund.code)
                          }}
                          className="text-gray-400 hover:text-red-500"
                        />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar size="small" icon={<FundOutlined />} className="bg-gray-500" />
                      }
                      title={
                        <div className="flex items-center space-x-2">
                          <Text className="text-sm font-medium truncate">{fund.name}</Text>
                          <Tag color={getFundTypeInfo(fund.type).color}>
                            {getFundTypeInfo(fund.type).label}
                          </Tag>
                        </div>
                      }
                      description={
                        <div className="flex items-center justify-between">
                          <Text className="text-xs text-gray-500">{fund.code}</Text>
                          <div className="text-right">
                            <div className="text-xs">{fund.currentValue.toFixed(4)}</div>
                            <div
                              className="text-xs"
                              style={{
                                color: fund.dailyChange >= 0 ? '#52c41a' : '#ff4d4f',
                              }}
                            >
                              {fund.dailyChange >= 0 ? '+' : ''}
                              {fund.dailyChangePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundSelectionPanel

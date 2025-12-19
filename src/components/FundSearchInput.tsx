import { SearchOutlined, FundOutlined } from '@ant-design/icons'
import { AutoComplete, Avatar, Input, Tag, Typography } from 'antd'
import { debounce } from 'lodash-es'
import React, { useState, useCallback, useMemo } from 'react'
import type { Fund } from '@/types'

const { Text } = Typography

interface FundSearchInputProps {
  funds: Fund[]
  onFundSelect: (fund: Fund) => void
  placeholder?: string
  className?: string
  size?: 'small' | 'middle' | 'large'
  loading?: boolean
}

interface SearchOption {
  value: string
  label: React.ReactNode
  fund: Fund
}

const FundSearchInput: React.FC<FundSearchInputProps> = ({
  funds,
  onFundSelect,
  placeholder = '搜索基金名称或代码',
  className = '',
  size = 'middle',
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [options, setOptions] = useState<SearchOption[]>([])

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

  // Format change percentage with color
  const formatChangePercent = (changePercent: number) => {
    const color = changePercent >= 0 ? '#52c41a' : '#ff4d4f'
    const sign = changePercent >= 0 ? '+' : ''
    return (
      <Text style={{ color, fontSize: '12px' }}>
        {sign}
        {changePercent.toFixed(2)}%
      </Text>
    )
  }

  // Search function
  const searchFunds = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setOptions([])
        return
      }

      const searchQuery = query.toLowerCase()
      const filteredFunds = funds
        .filter(
          fund =>
            fund.name.toLowerCase().includes(searchQuery) ||
            fund.code.toLowerCase().includes(searchQuery)
        )
        .slice(0, 10) // Limit to 10 results

      const searchOptions: SearchOption[] = filteredFunds.map(fund => {
        const typeInfo = getFundTypeInfo(fund.type)

        return {
          value: `${fund.name} (${fund.code})`,
          fund,
          label: (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3 flex-1">
                <Avatar size="small" icon={<FundOutlined />} className="bg-primary-500" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <Text className="font-medium truncate">{fund.name}</Text>
                    <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
                  </div>
                  <Text className="text-xs text-gray-500">{fund.code}</Text>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className="text-sm font-medium">{fund.currentValue.toFixed(4)}</div>
                {formatChangePercent(fund.dailyChangePercent)}
              </div>
            </div>
          ),
        }
      })

      setOptions(searchOptions)
    },
    [funds]
  )

  // Debounced search
  const debouncedSearch = useMemo(() => debounce(searchFunds, 300), [searchFunds])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    debouncedSearch(value)
  }

  const handleSelect = (value: string, option: SearchOption) => {
    onFundSelect(option.fund)
    setSearchValue('')
    setOptions([])
  }

  const handleClear = () => {
    setSearchValue('')
    setOptions([])
  }

  return (
    <AutoComplete
      className={className}
      size={size}
      value={searchValue}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onClear={handleClear}
      placeholder={placeholder}
      allowClear
      showSearch
      filterOption={false}
      notFoundContent={
        searchValue ? (
          <div className="text-center py-4">
            <Text className="text-gray-500">未找到匹配的基金</Text>
          </div>
        ) : null
      }
    >
      <Input prefix={<SearchOutlined className="text-gray-400" />} />
    </AutoComplete>
  )
}

export default FundSearchInput

import { Row, Col, Skeleton } from 'antd'
import React from 'react'
import ErrorDisplay from './ErrorDisplay'
import MarketIndexCard from './MarketIndexCard'
import type { MarketIndex } from '@/types'

interface MarketOverviewProps {
  indices: MarketIndex[]
  loading?: boolean
  error?: any
  onIndexClick?: (index: MarketIndex) => void
  onRetry?: () => void
}

const MarketOverview: React.FC<MarketOverviewProps> = ({
  indices,
  loading = false,
  error,
  onIndexClick,
  onRetry,
}) => {
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} size="small" />
  }

  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4].map(key => (
          <Col xs={24} sm={12} lg={6} key={key}>
            <Skeleton.Button active style={{ width: '100%', height: '120px' }} shape="round" />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <Row gutter={[24, 24]}>
      {indices.map(index => (
        <Col xs={24} sm={12} lg={6} key={index.code}>
          <MarketIndexCard index={index} onClick={() => onIndexClick?.(index)} />
        </Col>
      ))}
    </Row>
  )
}

export default MarketOverview

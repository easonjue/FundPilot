import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Button, Space } from "antd";
import {
  ReloadOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
  BellOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
import MarketOverview from "@/components/MarketOverview";
import FundPerformanceChart from "@/components/FundPerformanceChart";
import AIRecommendationsPanel from "@/components/AIRecommendationsPanel";
import { useAsync } from "@/hooks";
import useRealTimeData from "@/hooks/useRealTimeData";
import DataFreshnessIndicator from "@/components/DataFreshnessIndicator";
import type {
  MarketIndex,
  Fund,
  FundDataPoint,
  TimeRange,
  AIPrediction,
} from "@/types";

// Mock data for demonstration
const mockMarketIndices: MarketIndex[] = [
  {
    name: "沪深300",
    code: "CSI300",
    value: 3456.78,
    change: 42.56,
    changePercent: 1.25,
    trend: "up",
  },
  {
    name: "创业板",
    code: "SZSE",
    value: 2234.56,
    change: -10.23,
    changePercent: -0.45,
    trend: "down",
  },
  {
    name: "恒生指数",
    code: "HSI",
    value: 18234.56,
    change: 141.23,
    changePercent: 0.78,
    trend: "up",
  },
  {
    name: "纳斯达克",
    code: "NASDAQ",
    value: 14567.89,
    change: 306.45,
    changePercent: 2.15,
    trend: "up",
  },
];

const mockFunds: Fund[] = [
  {
    code: "001938",
    name: "易方达消费精选",
    type: "mixed",
    currentValue: 2.1234,
    dailyChange: 0.0123,
    dailyChangePercent: 0.58,
    lastUpdate: new Date(),
  },
  {
    code: "320007",
    name: "华夏科技成长",
    type: "stock",
    currentValue: 1.8765,
    dailyChange: -0.0087,
    dailyChangePercent: -0.46,
    lastUpdate: new Date(),
  },
  {
    code: "161725",
    name: "招商中证白酒",
    type: "index",
    currentValue: 0.9876,
    dailyChange: 0.0034,
    dailyChangePercent: 0.35,
    lastUpdate: new Date(),
  },
];

// Generate mock historical data
const generateMockFundData = (
  fundCode: string,
  days: number = 30
): FundDataPoint[] => {
  const data: FundDataPoint[] = [];
  const baseValue = Math.random() * 2 + 1; // Random base value between 1-3

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const randomChange = (Math.random() - 0.5) * 0.1;
    const value = baseValue + Math.sin(i * 0.1) * 0.2 + randomChange;

    data.push({
      date,
      value: Math.max(0.1, value), // Ensure positive value
      volume: Math.floor(Math.random() * 1000000),
    });
  }

  return data;
};

// Mock AI predictions
const mockAIPredictions: Array<AIPrediction & { fundName: string }> = [
  {
    fundCode: "001938",
    fundName: "易方达消费精选",
    direction: "up",
    confidence: 0.85,
    suggestion: "buy",
    reason:
      "AI预测上涨概率85%，RSI指标显示超卖状态，技术面支撑强劲，建议适量加仓。",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  {
    fundCode: "320007",
    fundName: "华夏科技成长",
    direction: "down",
    confidence: 0.72,
    suggestion: "sell",
    reason:
      "市场情绪偏弱，科技板块面临调整压力，MACD指标显示下行趋势，建议减仓观望。",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    fundCode: "161725",
    fundName: "招商中证白酒",
    direction: "neutral",
    confidence: 0.68,
    suggestion: "hold",
    reason:
      "白酒板块震荡整理，基本面稳健但缺乏催化剂，建议维持现有仓位等待机会。",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
];

const Dashboard: React.FC = () => {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([
    "001938",
    "320007",
  ]);
  const [timeRange, setTimeRange] = useState<TimeRange>("1M");
  const [fundData, setFundData] = useState<Record<string, FundDataPoint[]>>({});
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Mock API call for market indices
  const fetchMarketIndices = async (): Promise<MarketIndex[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate random data changes
    return mockMarketIndices.map((index) => ({
      ...index,
      value: index.value + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 3,
      trend:
        Math.random() > 0.5 ? "up" : Math.random() > 0.3 ? "down" : "neutral",
    }));
  };

  // Generate fund data when component mounts or time range changes
  useEffect(() => {
    const days =
      timeRange === "1D"
        ? 1
        : timeRange === "1W"
        ? 7
        : timeRange === "1M"
        ? 30
        : timeRange === "3M"
        ? 90
        : timeRange === "6M"
        ? 180
        : timeRange === "1Y"
        ? 365
        : 30;

    const newFundData: Record<string, FundDataPoint[]> = {};
    mockFunds.forEach((fund) => {
      newFundData[fund.code] = generateMockFundData(fund.code, days);
    });
    setFundData(newFundData);
  }, [timeRange]);

  const {
    data: marketIndices,
    loading: marketLoading,
    error: marketError,
    execute: refetchMarketData,
  } = useAsync(fetchMarketIndices, [], { immediate: true });

  // Real-time data updates
  const {
    lastUpdate,
    nextUpdate,
    isUpdating: isAutoUpdating,
    isMarketHours,
    refresh: triggerRefresh,
  } = useRealTimeData({
    interval: 5 * 60 * 1000, // 5 minutes
    enabled: autoRefreshEnabled,
    onUpdate: refetchMarketData,
    marketHoursOnly: true,
  });

  const handleRefresh = () => {
    triggerRefresh();
  };

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  const handleIndexClick = (index: MarketIndex) => {
    console.log("Clicked index:", index);
    // TODO: Navigate to detailed view or show more info
  };

  const handleAIActionClick = (
    fundCode: string,
    action: "buy" | "sell" | "hold"
  ) => {
    console.log(`AI Action: ${action} for fund ${fundCode}`);
    // TODO: Implement trading action or navigate to trading page
  };

  return (
    <div className="px-6 py-6 space-y-8">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">总资产</p>
              <p className="text-2xl font-bold">¥128,456</p>
              <p className="text-blue-200 text-xs">+2.34%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              💰
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">今日收益</p>
              <p className="text-2xl font-bold">+¥2,345</p>
              <p className="text-green-200 text-xs">+1.87%</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              📈
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">持仓基金</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-purple-200 text-xs">活跃</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              🎯
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">AI信号</p>
              <p className="text-2xl font-bold">5</p>
              <p className="text-orange-200 text-xs">待处理</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              🤖
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Title level={3} className="mb-1 text-gray-900 dark:text-gray-100">
              市场概览
            </Title>
            <Text className="text-gray-500 dark:text-gray-400">
              主要指数实时行情
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <DataFreshnessIndicator
              lastUpdate={lastUpdate}
              nextUpdate={nextUpdate}
              isUpdating={marketLoading || isAutoUpdating}
              isMarketHours={isMarketHours}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={marketLoading || isAutoUpdating}
              type="text"
              shape="circle"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            />
          </div>
        </div>
        <MarketOverview
          indices={marketIndices || []}
          loading={marketLoading}
          error={marketError}
          onIndexClick={handleIndexClick}
          onRetry={refetchMarketData}
        />
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fund Performance Chart */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <FundPerformanceChart
            funds={mockFunds}
            selectedFunds={selectedFunds}
            fundData={fundData}
            timeRange={timeRange}
            onFundSelectionChange={setSelectedFunds}
            onTimeRangeChange={setTimeRange}
          />
        </div>

        {/* AI Recommendations */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <AIRecommendationsPanel
            predictions={mockAIPredictions}
            onActionClick={handleAIActionClick}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LineChartOutlined className="text-2xl text-white" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              基金分析
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              深度技术分析
            </p>
          </div>
        </button>

        <button className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ThunderboltOutlined className="text-2xl text-white" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              策略信号
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI交易建议
            </p>
          </div>
        </button>

        <button className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <BellOutlined className="text-2xl text-white" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              消息通知
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">实时提醒</p>
          </div>
        </button>

        <button className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:scale-105 transition-transform duration-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <SettingOutlined className="text-2xl text-white" />
            </div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              系统设置
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              个性化配置
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

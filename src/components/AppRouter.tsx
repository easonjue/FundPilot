import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import ModuleErrorBoundary from '@/components/ModuleErrorBoundary'

// Lazy load modules for code splitting
const Dashboard = React.lazy(() => import('@/modules/Dashboard'))
const FundAnalysis = React.lazy(() => import('@/modules/FundAnalysis'))
const Strategy = React.lazy(() => import('@/modules/Strategy'))
const Notifications = React.lazy(() => import('@/modules/Notifications'))
const Settings = React.lazy(() => import('@/modules/Settings'))

const AppRouter: React.FC = () => {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner message="加载中..." />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <ModuleErrorBoundary moduleName="仪表盘">
                <Dashboard />
              </ModuleErrorBoundary>
            }
          />
          <Route
            path="/analysis"
            element={
              <ModuleErrorBoundary moduleName="基金分析">
                <FundAnalysis />
              </ModuleErrorBoundary>
            }
          />
          <Route
            path="/strategy"
            element={
              <ModuleErrorBoundary moduleName="策略信号">
                <Strategy />
              </ModuleErrorBoundary>
            }
          />
          <Route
            path="/notifications"
            element={
              <ModuleErrorBoundary moduleName="推送配置">
                <Notifications />
              </ModuleErrorBoundary>
            }
          />
          <Route
            path="/settings"
            element={
              <ModuleErrorBoundary moduleName="系统设置">
                <Settings />
              </ModuleErrorBoundary>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default AppRouter

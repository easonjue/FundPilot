import { ReloadOutlined, BugOutlined } from '@ant-design/icons'
import { Card, Button, Alert } from 'antd'
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  moduleName?: string
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ModuleErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `ModuleErrorBoundary (${this.props.moduleName}) caught an error:`,
      error,
      errorInfo
    )
    this.setState({
      error,
      errorInfo,
    })
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <Card className="m-4">
          <Alert
            message={`${this.props.moduleName || '模块'}加载失败`}
            description="该模块遇到了意外错误，请尝试刷新或联系技术支持。"
            type="error"
            showIcon
            icon={<BugOutlined />}
            action={
              <Button
                size="small"
                type="primary"
                onClick={this.handleRetry}
                icon={<ReloadOutlined />}
              >
                重新加载
              </Button>
            }
          />

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <details>
                <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">
                  错误详情 (开发模式)
                </summary>
                <pre className="mt-2 text-sm text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            </div>
          )}
        </Card>
      )
    }

    return this.props.children
  }
}

export default ModuleErrorBoundary

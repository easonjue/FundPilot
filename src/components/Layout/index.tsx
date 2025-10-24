import React from 'react'
import AdaptiveLayout from './AdaptiveLayout'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <AdaptiveLayout>{children}</AdaptiveLayout>
}

export default Layout
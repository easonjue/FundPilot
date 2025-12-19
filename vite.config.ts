import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
const GITHUB_PAGES_DOMAIN = 'easonjue.github.io'
// 仓库名https://github.com/easonjue/FundPilot.git
const GITHUB_REPO_NAME = 'FundPilot'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `https://${GITHUB_PAGES_DOMAIN}/${GITHUB_REPO_NAME}/` : '/',
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#2D6DF6',
          '@success-color': '#13C2C2',
          '@error-color': '#FF4D4F',
          '@border-radius-base': '8px',
        },
      },
    },
    modules: {
      localsConvention: 'camelCase',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/api': path.resolve(__dirname, './src/api'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          antd: ['antd'],
          echarts: ['echarts', 'echarts-for-react'],
          router: ['react-router-dom'],
        },
      },
    },
  },
  // test: {
  //   globals: true,
  //   environment: 'jsdom',
  //   setupFiles: ['./src/test/setup.ts'],
  // },
}))

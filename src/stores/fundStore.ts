import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Fund, FundDataPoint } from '@/types'

interface FundState {
  // Fund data
  funds: Fund[]
  selectedFunds: string[]
  fundData: Record<string, FundDataPoint[]>

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  setFunds: (funds: Fund[]) => void
  addFund: (fund: Fund) => void
  removeFund: (fundCode: string) => void
  setSelectedFunds: (fundCodes: string[]) => void
  addToWatchlist: (fundCode: string) => void
  removeFromWatchlist: (fundCode: string) => void
  setFundData: (fundCode: string, data: FundDataPoint[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getSelectedFundsData: () => Fund[]
  getFundByCode: (code: string) => Fund | undefined
}

export const useFundStore = create<FundState>()(
  persist(
    (set, get) => ({
      // Initial state
      funds: [],
      selectedFunds: [],
      fundData: {},
      isLoading: false,
      error: null,

      // Actions
      setFunds: funds => set({ funds }),

      addFund: fund =>
        set(state => ({
          funds: [...state.funds.filter(f => f.code !== fund.code), fund],
        })),

      removeFund: fundCode =>
        set(state => ({
          funds: state.funds.filter(f => f.code !== fundCode),
          selectedFunds: state.selectedFunds.filter(code => code !== fundCode),
        })),

      setSelectedFunds: fundCodes => set({ selectedFunds: fundCodes }),

      addToWatchlist: fundCode =>
        set(state => ({
          selectedFunds: state.selectedFunds.includes(fundCode)
            ? state.selectedFunds
            : [...state.selectedFunds, fundCode],
        })),

      removeFromWatchlist: fundCode =>
        set(state => ({
          selectedFunds: state.selectedFunds.filter(code => code !== fundCode),
        })),

      setFundData: (fundCode, data) =>
        set(state => ({
          fundData: { ...state.fundData, [fundCode]: data },
        })),

      setLoading: loading => set({ isLoading: loading }),

      setError: error => set({ error }),

      // Computed
      getSelectedFundsData: () => {
        const { funds, selectedFunds } = get()
        return funds.filter(fund => selectedFunds.includes(fund.code))
      },

      getFundByCode: code => {
        const { funds } = get()
        return funds.find(fund => fund.code === code)
      },
    }),
    {
      name: 'fundpilot-funds',
      partialize: state => ({
        selectedFunds: state.selectedFunds,
        funds: state.funds,
      }),
    }
  )
)

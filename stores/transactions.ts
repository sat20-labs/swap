import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Transaction, TransactionFilter } from '~/types/transaction'

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([
    {
      id: '1',
      type: 'SWAP',
      fromAsset: 'BTC',
      toAsset: 'USDT',
      fromAmount: 0.5,
      toAmount: 32500,
      timestamp: Date.now() - 3600000,
      status: 'completed',
      hash: '0x1234...5678',
      fee: 0.001
    },
    {
      id: '2',
      type: 'ADD_LIQUIDITY',
      fromAsset: 'ETH',
      toAsset: 'USDT',
      fromAmount: 10,
      toAmount: 35000,
      timestamp: Date.now() - 7200000,
      status: 'completed',
      hash: '0x5678...9012',
      fee: 0.002
    },
    {
      id: '3',
      type: 'MINT',
      fromAsset: 'MEME',
      toAsset: 'MEME',
      fromAmount: 0,
      toAmount: 1000,
      timestamp: Date.now() - 86400000,
      status: 'completed',
      hash: '0x9012...3456',
      fee: 0.0005
    }
  ])

  const filteredTransactions = computed(() => {
    return (filter: TransactionFilter) => {
      return transactions.value.filter(tx => {
        if (filter.type && tx.type !== filter.type) return false
        if (filter.asset && tx.fromAsset !== filter.asset && tx.toAsset !== filter.asset) return false
        if (filter.startDate && tx.timestamp < filter.startDate.getTime()) return false
        if (filter.endDate && tx.timestamp > filter.endDate.getTime()) return false
        return true
      })
    }
  })

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const id = (transactions.value.length + 1).toString()
    transactions.value.unshift({ ...transaction, id })
  }

  return {
    transactions,
    filteredTransactions,
    addTransaction
  }
})
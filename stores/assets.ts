import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Asset } from '~/types/asset'
import { calculateValue } from '~/utils/price'

export const useAssetsStore = defineStore('assets', () => {
  const assets = ref<Asset[]>([
    { 
      id: '1', 
      symbol: 'BTC', 
      name: 'Bitcoin', 
      balance: 1.2, 
      price: 65000,
      type: 'SAT20'
    },
    { 
      id: '2', 
      symbol: 'ORDI', 
      name: 'Ordinals', 
      balance: 1000, 
      price: 50,
      type: 'BRC20'
    },
    { 
      id: '3', 
      symbol: 'MEME', 
      name: 'Memecoin', 
      balance: 5000, 
      price: 0.1,
      type: 'RUNE'
    },
    { 
      id: '4', 
      symbol: 'USDT', 
      name: 'Tether', 
      balance: 10000, 
      price: 1,
      type: 'OTHER'
    }
  ])

  // Getters
  const getAssetById = computed(() => {
    return (id: string) => assets.value.find(asset => asset.id === id)
  })

  const totalPortfolioValue = computed(() => {
    return assets.value.reduce((total, asset) => {
      return total + calculateValue(asset.balance, asset.price)
    }, 0)
  })

  // Actions
  const updateAssetBalance = (assetId: string, newBalance: number) => {
    const asset = assets.value.find(a => a.id === assetId)
    if (asset) {
      asset.balance = newBalance
    }
  }

  return {
    assets,
    getAssetById,
    totalPortfolioValue,
    updateAssetBalance
  }
})
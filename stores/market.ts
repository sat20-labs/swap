import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MarketStats, TradingPair } from '~/types/market'

export const useMarketStore = defineStore('market', () => {
  const marketStats = ref<MarketStats[]>([
    {
      id: 'eth-usdt',
      pair: 'ETH/USDT',
      price: 3500,
      volume24h: 1250000,
      change24h: 2.5,
      tvl: 5000000
    },
    {
      id: 'btc-usdt',
      pair: 'BTC/USDT',
      price: 65000,
      volume24h: 3500000,
      change24h: -1.2,
      tvl: 12000000
    }
  ])

  const tradingPairs = ref<TradingPair[]>([
    {
      id: 'eth-usdt',
      baseAsset: 'ETH',
      quoteAsset: 'USDT',
      lastPrice: 3500,
      volume24h: 1250000,
      change24h: 2.5
    },
    {
      id: 'btc-usdt',
      baseAsset: 'BTC',
      quoteAsset: 'USDT',
      lastPrice: 65000,
      volume24h: 3500000,
      change24h: -1.2
    }
  ])

  const totalVolume24h = computed(() => 
    marketStats.value.reduce((total, stat) => total + stat.volume24h, 0)
  )

  const totalTVL = computed(() => 
    marketStats.value.reduce((total, stat) => total + stat.tvl, 0)
  )

  return {
    marketStats,
    tradingPairs,
    totalVolume24h,
    totalTVL
  }
})
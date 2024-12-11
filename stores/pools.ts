import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LiquidityPool, PoolPosition } from '~/types/pool'

export const usePoolsStore = defineStore('pools', () => {
  const pools = ref<LiquidityPool[]>([
    {
      id: 'btc-usdt',
      token0: 'BTC',
      token1: 'USDT',
      token0Balance: 100,
      token1Balance: 6500000,
      apr: 12.5,
      totalLiquidity: 6500000,
      userLiquidity: 65000,
      rewards: 150,
      volume24h: 1200000
    },
    {
      id: 'eth-usdt',
      token0: 'ETH',
      token1: 'USDT',
      token0Balance: 1000,
      token1Balance: 3500000,
      apr: 8.2,
      totalLiquidity: 3500000,
      userLiquidity: 35000,
      rewards: 80,
      volume24h: 800000
    }
  ])

  const userPositions = ref<PoolPosition[]>([
    {
      poolId: 'btc-usdt',
      token0Amount: 1,
      token1Amount: 65000,
      share: 0.01,
      value: 65000
    }
  ])

  const totalValueLocked = computed(() => 
    pools.value.reduce((total, pool) => total + pool.totalLiquidity, 0)
  )

  const totalUserLiquidity = computed(() => 
    pools.value.reduce((total, pool) => total + pool.userLiquidity, 0)
  )

  const getPoolById = computed(() => {
    return (id: string) => pools.value.find(pool => pool.id === id)
  })

  const getUserPositionByPoolId = computed(() => {
    return (poolId: string) => userPositions.value.find(pos => pos.poolId === poolId)
  })

  return {
    pools,
    userPositions,
    totalValueLocked,
    totalUserLiquidity,
    getPoolById,
    getUserPositionByPoolId
  }
})
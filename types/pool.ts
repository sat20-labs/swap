export interface LiquidityPool {
  id: string
  token0: string
  token1: string
  token0Balance: number
  token1Balance: number
  apr: number
  totalLiquidity: number
  userLiquidity: number
  rewards: number
  volume24h: number
}

export interface PoolPosition {
  poolId: string
  token0Amount: number
  token1Amount: number
  share: number
  value: number
}
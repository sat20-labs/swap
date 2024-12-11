export interface MarketStats {
  id: string
  pair: string
  price: number
  volume24h: number
  change24h: number
  tvl: number
}

export interface TradingPair {
  id: string
  baseAsset: string
  quoteAsset: string
  lastPrice: number
  volume24h: number
  change24h: number
}
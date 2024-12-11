export interface Asset {
  id: string
  symbol: string
  name: string
  balance: number
  price: number
  type: 'SAT20' | 'BRC20' | 'RUNE' | 'OTHER'
  icon?: string
}

export interface AssetPair {
  fromAsset: Asset
  toAsset: Asset
  rate: number
}

export interface TradePreview {
  fromAmount: number
  toAmount: number
  rate: number
  priceImpact: number
  fee: number
  minReceived: number
}
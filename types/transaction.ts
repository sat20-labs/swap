export type TransactionType = 'SWAP' | 'ADD_LIQUIDITY' | 'REMOVE_LIQUIDITY' | 'MINT'

export interface Transaction {
  id: string
  type: TransactionType
  fromAsset: string
  toAsset: string
  fromAmount: number
  toAmount: number
  timestamp: number
  status: 'completed' | 'pending' | 'failed'
  hash: string
  fee: number
}

export interface TransactionFilter {
  type?: TransactionType
  asset?: string
  startDate?: Date
  endDate?: Date
}
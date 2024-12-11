import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Asset, AssetPair } from '~/types/asset'
import { useAssetsStore } from './assets'

export const useTradingStore = defineStore('trading', () => {
  const fromAssetId = ref<string>('')
  const toAssetId = ref<string>('')
  const amount = ref<number>(0)

  const assetsStore = useAssetsStore()

  // Getters
  const selectedPair = computed(() => {
    const fromAsset = assetsStore.getAssetById(fromAssetId.value)
    const toAsset = assetsStore.getAssetById(toAssetId.value)
    
    if (!fromAsset || !toAsset) return null

    return {
      fromAsset,
      toAsset,
      rate: toAsset.price / fromAsset.price
    } as AssetPair
  })

  const estimatedOutput = computed(() => {
    if (!selectedPair.value) return 0
    return amount.value * selectedPair.value.rate
  })

  // Actions
  const setFromAsset = (assetId: string) => {
    fromAssetId.value = assetId
  }

  const setToAsset = (assetId: string) => {
    toAssetId.value = assetId
  }

  const setAmount = (value: number) => {
    amount.value = value
  }

  const executeTrade = () => {
    if (!selectedPair.value || amount.value <= 0) return false

    const { fromAsset, toAsset } = selectedPair.value
    
    if (fromAsset.balance < amount.value) return false

    assetsStore.updateAssetBalance(fromAsset.id, fromAsset.balance - amount.value)
    assetsStore.updateAssetBalance(toAsset.id, toAsset.balance + estimatedOutput.value)

    return true
  }

  return {
    fromAssetId,
    toAssetId,
    amount,
    selectedPair,
    estimatedOutput,
    setFromAsset,
    setToAsset,
    setAmount,
    executeTrade
  }
})
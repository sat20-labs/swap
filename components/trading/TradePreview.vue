<template>
  <div class="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">Rate</span>
      <span>1 {{ preview.fromAsset.symbol }} = {{ formatNumber(preview.rate) }} {{ preview.toAsset.symbol }}</span>
    </div>
    
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">Price Impact</span>
      <span :class="preview.priceImpact > 2 ? 'text-red-500' : 'text-green-500'">
        {{ preview.priceImpact.toFixed(2) }}%
      </span>
    </div>
    
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">Network Fee</span>
      <span>${{ formatNumber(preview.fee) }}</span>
    </div>
    
    <div class="flex justify-between text-sm">
      <span class="text-gray-600 dark:text-gray-400">Minimum Received</span>
      <span>{{ formatNumber(preview.minReceived) }} {{ preview.toAsset.symbol }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Asset } from '~/types/asset'

interface Preview {
  fromAsset: Asset
  toAsset: Asset
  rate: number
  priceImpact: number
  fee: number
  minReceived: number
}

const props = defineProps<{
  preview: Preview
}>()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}
</script>
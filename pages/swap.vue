<template>
  <div class="max-w-xl mx-auto px-4">
    <SwapInterface />
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '~/stores/market'
import { useTradingStore } from '~/stores/trading'
import { useAssetsStore } from '~/stores/assets'

const marketStore = useMarketStore()
const tradingStore = useTradingStore()
const assetsStore = useAssetsStore()
</script>
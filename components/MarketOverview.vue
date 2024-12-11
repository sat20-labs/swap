<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <UCard>
      <div class="text-center">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total Volume (24h)
        </h3>
        <p class="mt-2 text-2xl font-semibold">
          {{ formatPrice(marketStore.totalVolume24h) }}
        </p>
      </div>
    </UCard>
    
    <UCard>
      <div class="text-center">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total TVL
        </h3>
        <p class="mt-2 text-2xl font-semibold">
          {{ formatPrice(marketStore.totalTVL) }}
        </p>
      </div>
    </UCard>
    
    <UCard>
      <div class="text-center">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
          Active Pairs
        </h3>
        <p class="mt-2 text-2xl font-semibold">
          {{ marketStore.tradingPairs.length }}
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '~/stores/market'
import { formatPrice } from '~/utils/price'

const marketStore = useMarketStore()
</script>
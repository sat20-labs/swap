<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Trading Pairs</h2>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search pairs..."
          class="w-64"
        />
      </div>
    </template>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Pair</th>
            <th class="px-4 py-3 text-right text-sm font-semibold">Price</th>
            <th class="px-4 py-3 text-right text-sm font-semibold">24h Change</th>
            <th class="px-4 py-3 text-right text-sm font-semibold">24h Volume</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="pair in filteredPairs"
            :key="pair.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
            @click="selectPair(pair)"
          >
            <td class="px-4 py-4 text-sm">
              {{ pair.baseAsset }}/{{ pair.quoteAsset }}
            </td>
            <td class="px-4 py-4 text-sm text-right">
              {{ formatPrice(pair.lastPrice) }}
            </td>
            <td
              class="px-4 py-4 text-sm text-right"
              :class="pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'"
            >
              {{ pair.change24h >= 0 ? '+' : '' }}{{ pair.change24h.toFixed(2) }}%
            </td>
            <td class="px-4 py-4 text-sm text-right">
              {{ formatPrice(pair.volume24h) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMarketStore } from '~/stores/market'
import { formatPrice } from '~/utils/price'

const marketStore = useMarketStore()
const search = ref('')

const filteredPairs = computed(() => {
  const searchTerm = search.value.toLowerCase()
  return marketStore.tradingPairs.filter(pair => 
    `${pair.baseAsset}/${pair.quoteAsset}`.toLowerCase().includes(searchTerm)
  )
})

const emit = defineEmits(['select'])

const selectPair = (pair: any) => {
  emit('select', pair)
}
</script>
<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Portfolio Overview -->
    <UCard class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Portfolio Value
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ formatPrice(assetsStore.totalPortfolioValue) }}
          </p>
        </div>
        
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Assets
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ assetsStore.assets.length }}
          </p>
        </div>
        
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Asset Types
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ uniqueAssetTypes.length }}
          </p>
        </div>
      </div>
    </UCard>

    <!-- Assets List -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Your Assets</h2>
          <div class="flex gap-2">
            <USelect
              v-model="selectedType"
              :options="['All', 'SAT20', 'BRC20', 'RUNE', 'OTHER']"
              placeholder="Filter by type"
              class="w-40"
            />
            <UButton
              to="/mint"
              icon="i-heroicons-plus"
              class="bg-purple-600 hover:bg-purple-700"
            >
              Mint New Asset
            </UButton>
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold">Asset</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Balance</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Price</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Value</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="asset in filteredAssets"
              :key="asset.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {{ asset.symbol.slice(0, 2) }}
                  </div>
                  <div>
                    <div class="font-medium">{{ asset.symbol }}</div>
                    <div class="text-sm text-gray-500">{{ asset.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="getAssetTypeColor(asset.type)"
                  variant="subtle"
                >
                  {{ asset.type }}
                </UBadge>
              </td>
              <td class="px-4 py-4 text-right">
                {{ formatNumber(asset.balance) }}
              </td>
              <td class="px-4 py-4 text-right">
                {{ formatPrice(asset.price) }}
              </td>
              <td class="px-4 py-4 text-right">
                {{ formatPrice(asset.balance * asset.price) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-arrow-path"
                    :to="`/swap?from=${asset.symbol}`"
                  />
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-plus-circle"
                    :to="`/pools/add?asset=${asset.symbol}`"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAssetsStore } from '~/stores/assets'
import { formatPrice } from '~/utils/price'

const assetsStore = useAssetsStore()
const selectedType = ref('All')

const uniqueAssetTypes = computed(() => 
  Array.from(new Set(assetsStore.assets.map(asset => asset.type)))
)

const filteredAssets = computed(() => {
  if (selectedType.value === 'All') return assetsStore.assets
  return assetsStore.assets.filter(asset => asset.type === selectedType.value)
})

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}

const getAssetTypeColor = (type: string) => {
  switch (type) {
    case 'SAT20': return 'orange'
    case 'BRC20': return 'blue'
    case 'RUNE': return 'purple'
    default: return 'gray'
  }
}
</script>
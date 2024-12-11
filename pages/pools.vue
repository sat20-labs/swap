<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <UCard>
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Value Locked
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ formatPrice(poolsStore.totalValueLocked) }}
          </p>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Your Total Liquidity
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ formatPrice(poolsStore.totalUserLiquidity) }}
          </p>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Pools
          </h3>
          <p class="mt-2 text-2xl font-semibold">
            {{ poolsStore.pools.length }}
          </p>
        </div>
      </UCard>
    </div>

    <!-- Pools List -->
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Liquidity Pools</h2>
          <UButton
            to="/pools/add"
            icon="i-heroicons-plus"
            class="bg-purple-600 hover:bg-purple-700"
          >
            Add Liquidity
          </UButton>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold">Pool</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">TVL</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">APR</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Volume (24h)</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Your Position</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="pool in poolsStore.pools"
              :key="pool.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-4 text-sm">
                {{ pool.token0 }}/{{ pool.token1 }}
              </td>
              <td class="px-4 py-4 text-sm text-right">
                {{ formatPrice(pool.totalLiquidity) }}
              </td>
              <td class="px-4 py-4 text-sm text-right text-green-500">
                {{ pool.apr.toFixed(2) }}%
              </td>
              <td class="px-4 py-4 text-sm text-right">
                {{ formatPrice(pool.volume24h) }}
              </td>
              <td class="px-4 py-4 text-sm text-right">
                {{ formatPrice(pool.userLiquidity) }}
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-plus-circle"
                    :to="`/pools/${pool.id}/add`"
                  />
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-minus-circle"
                    :to="`/pools/${pool.id}/remove`"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Your Positions -->
    <UCard class="mt-8">
      <template #header>
        <h2 class="text-xl font-semibold">Your Positions</h2>
      </template>

      <div v-if="poolsStore.userPositions.length > 0" class="space-y-4">
        <div
          v-for="position in poolsStore.userPositions"
          :key="position.poolId"
          class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">
              {{ getPoolTokens(position.poolId) }}
            </h3>
            <span class="text-sm text-gray-500">
              Share: {{ (position.share * 100).toFixed(2) }}%
            </span>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500">Token Amount</div>
              <div>
                {{ position.token0Amount }} {{ getPoolToken0(position.poolId) }}
              </div>
              <div>
                {{ position.token1Amount }} {{ getPoolToken1(position.poolId) }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">Value</div>
              <div>{{ formatPrice(position.value) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        No positions found. Add liquidity to get started.
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { usePoolsStore } from '~/stores/pools'
import { formatPrice } from '~/utils/price'

const poolsStore = usePoolsStore()

const getPoolTokens = (poolId: string) => {
  const pool = poolsStore.getPoolById(poolId)
  return pool ? `${pool.token0}/${pool.token1}` : ''
}

const getPoolToken0 = (poolId: string) => {
  const pool = poolsStore.getPoolById(poolId)
  return pool?.token0 || ''
}

const getPoolToken1 = (poolId: string) => {
  const pool = poolsStore.getPoolById(poolId)
  return pool?.token1 || ''
}
</script>
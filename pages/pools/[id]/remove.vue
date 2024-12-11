<template>
  <div class="max-w-xl mx-auto px-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Remove Liquidity</h1>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            to="/pools"
          >
            Back
          </UButton>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Pool Info -->
        <div v-if="pool" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <div class="flex -space-x-2">
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {{ pool.token0.slice(0, 2) }}
                </div>
                <div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  {{ pool.token1.slice(0, 2) }}
                </div>
              </div>
              <span class="font-medium">{{ pool.token0 }}/{{ pool.token1 }}</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500 dark:text-gray-400">Your Liquidity</div>
              <div class="font-medium">{{ formatPrice(pool.userLiquidity) }}</div>
            </div>
            <div>
              <div class="text-gray-500 dark:text-gray-400">Your Share</div>
              <div class="font-medium">{{ userShare }}%</div>
            </div>
          </div>
        </div>

        <!-- Remove Amount -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount to Remove
          </label>
          
          <div class="flex items-center gap-4">
            <URange
              v-model="percentage"
              class="flex-1"
              :min="0"
              :max="100"
              :step="1"
            />
            <UInput
              v-model="percentage"
              type="number"
              class="w-20"
              :min="0"
              :max="100"
            />
            <span class="text-sm text-gray-500">%</span>
          </div>
        </div>

        <!-- Preview -->
        <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">You Will Receive</span>
            <div class="text-right">
              <div>{{ formatNumber(token0ToReceive) }} {{ pool?.token0 }}</div>
              <div>{{ formatNumber(token1ToReceive) }} {{ pool?.token1 }}</div>
            </div>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Share After</span>
            <span>{{ shareAfter }}%</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Value</span>
            <span>{{ formatPrice(valueToReceive) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <UButton
          block
          :loading="isLoading"
          :disabled="!canRemoveLiquidity"
          class="bg-purple-600 hover:bg-purple-700"
          @click="removeLiquidity"
        >
          {{ actionButtonText }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePoolsStore } from '~/stores/pools'
import { useAssetsStore } from '~/stores/assets'
import { formatPrice } from '~/utils/price'

const route = useRoute()
const poolsStore = usePoolsStore()
const assetsStore = useAssetsStore()

const pool = computed(() => poolsStore.getPoolById(route.params.id as string))
const position = computed(() => poolsStore.getUserPositionByPoolId(route.params.id as string))
const percentage = ref(0)
const isLoading = ref(false)

const userShare = computed(() => {
  if (!pool.value) return 0
  return ((pool.value.userLiquidity / pool.value.totalLiquidity) * 100).toFixed(2)
})

const shareAfter = computed(() => {
  if (!pool.value) return 0
  const remainingShare = Number(userShare.value) * (1 - percentage.value / 100)
  return remainingShare.toFixed(2)
})

const token0ToReceive = computed(() => {
  if (!position.value) return 0
  return position.value.token0Amount * (percentage.value / 100)
})

const token1ToReceive = computed(() => {
  if (!position.value) return 0
  return position.value.token1Amount * (percentage.value / 100)
})

const valueToReceive = computed(() => {
  if (!pool.value) return 0
  return pool.value.userLiquidity * (percentage.value / 100)
})

const canRemoveLiquidity = computed(() => 
  percentage.value > 0 && percentage.value <= 100
)

const actionButtonText = computed(() => {
  if (percentage.value <= 0) return 'Enter amount to remove'
  if (percentage.value > 100) return 'Invalid amount'
  return 'Remove Liquidity'
})

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}

const removeLiquidity = async () => {
  if (!pool.value || !canRemoveLiquidity.value || !position.value) return
  
  isLoading.value = true
  
  try {
    const removalRatio = percentage.value / 100
    
    // Update pool balances
    pool.value.token0Balance -= position.value.token0Amount * removalRatio
    pool.value.token1Balance -= position.value.token1Amount * removalRatio
    pool.value.totalLiquidity -= pool.value.userLiquidity * removalRatio
    pool.value.userLiquidity -= pool.value.userLiquidity * removalRatio
    
    // Update user asset balances
    const token0Asset = assetsStore.assets.find(a => a.symbol === pool.value?.token0)
    const token1Asset = assetsStore.assets.find(a => a.symbol === pool.value?.token1)
    
    if (token0Asset) token0Asset.balance += token0ToReceive.value
    if (token1Asset) token1Asset.balance += token1ToReceive.value
    
    // Update position
    position.value.token0Amount -= token0ToReceive.value
    position.value.token1Amount -= token1ToReceive.value
    position.value.share = Number(shareAfter.value) / 100
    position.value.value -= valueToReceive.value
    
    // Remove position if fully withdrawn
    if (percentage.value === 100) {
      const index = poolsStore.userPositions.findIndex(p => p.poolId === pool.value?.id)
      if (index !== -1) {
        poolsStore.userPositions.splice(index, 1)
      }
    }
    
    // Navigate back to pools page
    navigateTo('/pools')
  } catch (error) {
    console.error('Failed to remove liquidity:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
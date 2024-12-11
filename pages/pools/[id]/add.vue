<template>
  <div class="max-w-xl mx-auto px-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Add Liquidity</h1>
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
            <UBadge
              color="green"
              variant="subtle"
            >
              {{ pool.apr.toFixed(2) }}% APR
            </UBadge>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-500 dark:text-gray-400">Total Liquidity</div>
              <div class="font-medium">{{ formatPrice(pool.totalLiquidity) }}</div>
            </div>
            <div>
              <div class="text-gray-500 dark:text-gray-400">Your Share</div>
              <div class="font-medium">{{ userShare }}%</div>
            </div>
          </div>
        </div>

        <!-- Input Fields -->
        <div class="space-y-4">
          <div class="bg-gray-800/50 rounded-xl p-4">
            <div class="flex justify-between text-sm text-gray-400 mb-2">
              <span>{{ pool?.token0 }} Amount</span>
              <span>Balance: {{ formatNumber(token0Balance) }}</span>
            </div>
            <UInput
              v-model="token0Amount"
              type="number"
              min="0"
              :step="0.000001"
              class="bg-transparent"
              placeholder="0"
              @input="calculateToken1Amount"
            />
          </div>

          <div class="flex justify-center">
            <UIcon
              name="i-heroicons-plus"
              class="w-6 h-6 text-gray-400"
            />
          </div>

          <div class="bg-gray-800/50 rounded-xl p-4">
            <div class="flex justify-between text-sm text-gray-400 mb-2">
              <span>{{ pool?.token1 }} Amount</span>
              <span>Balance: {{ formatNumber(token1Balance) }}</span>
            </div>
            <UInput
              v-model="token1Amount"
              type="number"
              min="0"
              :step="0.000001"
              class="bg-transparent"
              placeholder="0"
              @input="calculateToken0Amount"
            />
          </div>
        </div>

        <!-- Preview -->
        <div v-if="canShowPreview" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Share of Pool</span>
            <span>{{ expectedShare }}%</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Expected LP Tokens</span>
            <span>{{ formatNumber(expectedLPTokens) }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <UButton
          block
          :loading="isLoading"
          :disabled="!canAddLiquidity"
          class="bg-purple-600 hover:bg-purple-700"
          @click="addLiquidity"
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
const token0Amount = ref('')
const token1Amount = ref('')
const isLoading = ref(false)

const token0Balance = computed(() => {
  const asset = assetsStore.assets.find(a => a.symbol === pool.value?.token0)
  return asset?.balance || 0
})

const token1Balance = computed(() => {
  const asset = assetsStore.assets.find(a => a.symbol === pool.value?.token1)
  return asset?.balance || 0
})

const userShare = computed(() => {
  if (!pool.value) return 0
  return ((pool.value.userLiquidity / pool.value.totalLiquidity) * 100).toFixed(2)
})

const expectedShare = computed(() => {
  if (!pool.value || !token0Amount.value || !token1Amount.value) return 0
  const addedValue = Number(token0Amount.value) * getTokenPrice(pool.value.token0)
  return ((addedValue / (pool.value.totalLiquidity + addedValue)) * 100).toFixed(2)
})

const expectedLPTokens = computed(() => {
  if (!pool.value || !token0Amount.value || !token1Amount.value) return 0
  return Math.sqrt(Number(token0Amount.value) * Number(token1Amount.value))
})

const canShowPreview = computed(() => 
  Number(token0Amount.value) > 0 && Number(token1Amount.value) > 0
)

const canAddLiquidity = computed(() => 
  Number(token0Amount.value) > 0 &&
  Number(token1Amount.value) > 0 &&
  Number(token0Amount.value) <= token0Balance.value &&
  Number(token1Amount.value) <= token1Balance.value
)

const actionButtonText = computed(() => {
  if (!token0Amount.value || !token1Amount.value) return 'Enter amounts'
  if (Number(token0Amount.value) > token0Balance.value) return `Insufficient ${pool.value?.token0} balance`
  if (Number(token1Amount.value) > token1Balance.value) return `Insufficient ${pool.value?.token1} balance`
  return 'Add Liquidity'
})

const getTokenPrice = (symbol: string) => {
  const asset = assetsStore.assets.find(a => a.symbol === symbol)
  return asset?.price || 0
}

const calculateToken1Amount = () => {
  if (!pool.value || !token0Amount.value) {
    token1Amount.value = ''
    return
  }
  
  const ratio = pool.value.token1Balance / pool.value.token0Balance
  token1Amount.value = (Number(token0Amount.value) * ratio).toString()
}

const calculateToken0Amount = () => {
  if (!pool.value || !token1Amount.value) {
    token0Amount.value = ''
    return
  }
  
  const ratio = pool.value.token0Balance / pool.value.token1Balance
  token0Amount.value = (Number(token1Amount.value) * ratio).toString()
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}

const addLiquidity = async () => {
  if (!pool.value || !canAddLiquidity.value) return
  
  isLoading.value = true
  
  try {
    // Update pool balances
    pool.value.token0Balance += Number(token0Amount.value)
    pool.value.token1Balance += Number(token1Amount.value)
    pool.value.totalLiquidity += Number(token0Amount.value) * getTokenPrice(pool.value.token0)
    pool.value.userLiquidity += Number(token0Amount.value) * getTokenPrice(pool.value.token0)
    
    // Update user asset balances
    const token0Asset = assetsStore.assets.find(a => a.symbol === pool.value?.token0)
    const token1Asset = assetsStore.assets.find(a => a.symbol === pool.value?.token1)
    
    if (token0Asset) token0Asset.balance -= Number(token0Amount.value)
    if (token1Asset) token1Asset.balance -= Number(token1Amount.value)
    
    // Add position if not exists
    const existingPosition = poolsStore.userPositions.find(p => p.poolId === pool.value?.id)
    if (existingPosition) {
      existingPosition.token0Amount += Number(token0Amount.value)
      existingPosition.token1Amount += Number(token1Amount.value)
      existingPosition.value += Number(token0Amount.value) * getTokenPrice(pool.value.token0) * 2
    } else {
      poolsStore.userPositions.push({
        poolId: pool.value.id,
        token0Amount: Number(token0Amount.value),
        token1Amount: Number(token1Amount.value),
        share: Number(expectedShare.value) / 100,
        value: Number(token0Amount.value) * getTokenPrice(pool.value.token0) * 2
      })
    }
    
    // Navigate back to pools page
    navigateTo('/pools')
  } catch (error) {
    console.error('Failed to add liquidity:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
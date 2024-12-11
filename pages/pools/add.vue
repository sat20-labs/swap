<template>
  <div class="max-w-xl mx-auto px-4">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">Create New Pool</h1>
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

      <form @submit.prevent="createPool" class="space-y-6">
        <!-- Token Selection -->
        <div class="space-y-4">
          <UFormGroup label="Token Pair" required>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-500 mb-2">Token 1</label>
                <AssetSelector
                  v-model="form.token0"
                  :assets="availableToken0Assets"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-500 mb-2">Token 2</label>
                <AssetSelector
                  v-model="form.token1"
                  :assets="availableToken1Assets"
                />
              </div>
            </div>
          </UFormGroup>
        </div>

        <!-- Initial Liquidity -->
        <div class="space-y-4">
          <h3 class="font-medium">Initial Liquidity</h3>

          <div class="bg-gray-800/50 rounded-xl p-4">
            <div class="flex justify-between text-sm text-gray-400 mb-2">
              <span>{{ form.token0?.symbol }} Amount</span>
              <span>Balance: {{ formatNumber(form.token0?.balance || 0) }}</span>
            </div>
            <UInput
              v-model="form.amount0"
              type="number"
              min="0"
              :step="0.000001"
              class="bg-transparent"
              placeholder="0"
              @input="calculateAmount1"
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
              <span>{{ form.token1?.symbol }} Amount</span>
              <span>Balance: {{ formatNumber(form.token1?.balance || 0) }}</span>
            </div>
            <UInput
              v-model="form.amount1"
              type="number"
              min="0"
              :step="0.000001"
              class="bg-transparent"
              placeholder="0"
              @input="calculateAmount0"
            />
          </div>
        </div>

        <!-- Pool Parameters -->
        <div v-if="canShowPreview" class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Initial Price</span>
            <span>1 {{ form.token0?.symbol }} = {{ formatNumber(initialPrice) }} {{ form.token1?.symbol }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Total Value Locked</span>
            <span>{{ formatPrice(totalValueLocked) }}</span>
          </div>
          
          <div class="flex justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400">Your Share</span>
            <span>100%</span>
          </div>
        </div>

        <!-- Submit Button -->
        <UButton
          type="submit"
          block
          :loading="isLoading"
          :disabled="!canCreatePool"
          class="bg-purple-600 hover:bg-purple-700"
        >
          {{ actionButtonText }}
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePoolsStore } from '~/stores/pools'
import { useAssetsStore } from '~/stores/assets'
import { formatPrice } from '~/utils/price'
import type { Asset } from '~/types/asset'

const router = useRouter()
const poolsStore = usePoolsStore()
const assetsStore = useAssetsStore()

const form = ref({
  token0: null as Asset | null,
  token1: null as Asset | null,
  amount0: '',
  amount1: ''
})

const isLoading = ref(false)

const availableToken0Assets = computed(() => assetsStore.assets)
const availableToken1Assets = computed(() => 
  assetsStore.assets.filter(asset => asset.id !== form.value.token0?.id)
)

const initialPrice = computed(() => {
  if (!form.value.amount0 || !form.value.amount1) return 0
  return Number(form.value.amount1) / Number(form.value.amount0)
})

const totalValueLocked = computed(() => {
  if (!form.value.token0 || !form.value.amount0) return 0
  return Number(form.value.amount0) * form.value.token0.price * 2
})

const canShowPreview = computed(() => 
  form.value.token0 &&
  form.value.token1 &&
  Number(form.value.amount0) > 0 &&
  Number(form.value.amount1) > 0
)

const canCreatePool = computed(() => 
  form.value.token0 &&
  form.value.token1 &&
  Number(form.value.amount0) > 0 &&
  Number(form.value.amount1) > 0 &&
  Number(form.value.amount0) <= form.value.token0.balance &&
  Number(form.value.amount1) <= form.value.token1.balance
)

const actionButtonText = computed(() => {
  if (!form.value.token0 || !form.value.token1) return 'Select tokens'
  if (!form.value.amount0 || !form.value.amount1) return 'Enter amounts'
  if (form.value.token0 && Number(form.value.amount0) > form.value.token0.balance) {
    return `Insufficient ${form.value.token0.symbol} balance`
  }
  if (form.value.token1 && Number(form.value.amount1) > form.value.token1.balance) {
    return `Insufficient ${form.value.token1.symbol} balance`
  }
  return 'Create Pool'
})

const calculateAmount1 = () => {
  if (!form.value.token0 || !form.value.token1 || !form.value.amount0) {
    form.value.amount1 = ''
    return
  }
  
  const price = form.value.token1.price / form.value.token0.price
  form.value.amount1 = (Number(form.value.amount0) * price).toString()
}

const calculateAmount0 = () => {
  if (!form.value.token0 || !form.value.token1 || !form.value.amount1) {
    form.value.amount0 = ''
    return
  }
  
  const price = form.value.token0.price / form.value.token1.price
  form.value.amount0 = (Number(form.value.amount1) * price).toString()
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}

const createPool = async () => {
  if (!canCreatePool.value) return
  
  isLoading.value = true
  
  try {
    const token0 = form.value.token0!
    const token1 = form.value.token1!
    const amount0 = Number(form.value.amount0)
    const amount1 = Number(form.value.amount1)
    
    // Create new pool
    const poolId = `${token0.symbol.toLowerCase()}-${token1.symbol.toLowerCase()}`
    const newPool = {
      id: poolId,
      token0: token0.symbol,
      token1: token1.symbol,
      token0Balance: amount0,
      token1Balance: amount1,
      apr: 10, // Initial APR
      totalLiquidity: amount0 * token0.price,
      userLiquidity: amount0 * token0.price,
      rewards: 0,
      volume24h: 0
    }
    
    poolsStore.pools.push(newPool)
    
    // Create user position
    poolsStore.userPositions.push({
      poolId,
      token0Amount: amount0,
      token1Amount: amount1,
      share: 1, // 100% share as initial provider
      value: amount0 * token0.price * 2
    })
    
    // Update token balances
    token0.balance -= amount0
    token1.balance -= amount1
    
    // Navigate to pools page
    router.push('/pools')
  } catch (error) {
    console.error('Failed to create pool:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
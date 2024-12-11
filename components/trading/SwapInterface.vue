<template>
  <div class="bg-gray-900 rounded-2xl p-4 shadow-xl">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl text-white font-medium">Swap</h2>
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-cog-6-tooth"
        class="text-gray-400 hover:text-white"
        @click="showSettings = true"
      />
    </div>

    <!-- Sell Section -->
    <div class="bg-gray-800/50 rounded-xl p-4 mb-2">
      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>Sell</span>
        <span>Balance: {{ formatNumber(fromAsset?.balance || 0) }}</span>
      </div>
      <div class="flex gap-4">
        <UInput
          v-model="amount"
          type="number"
          min="0"
          :step="0.000001"
          class="flex-1 bg-transparent"
          placeholder="0"
        />
        <AssetSelector
          v-model="fromAsset"
          :assets="availableFromAssets"
        />
      </div>
    </div>

    <!-- Swap Direction Button -->
    <div class="flex justify-center -my-4 relative z-10">
      <UButton
        color="gray"
        variant="solid"
        icon="i-heroicons-arrows-up-down"
        class="rounded-full bg-gray-800 hover:bg-gray-700"
        @click="swapDirection"
      />
    </div>

    <!-- Buy Section -->
    <div class="bg-gray-800/50 rounded-xl p-4 mt-2">
      <div class="flex justify-between text-sm text-gray-400 mb-2">
        <span>Buy</span>
        <span>Balance: {{ formatNumber(toAsset?.balance || 0) }}</span>
      </div>
      <div class="flex gap-4">
        <UInput
          :model-value="estimatedOutput"
          readonly
          class="flex-1 bg-transparent"
          placeholder="0"
        />
        <AssetSelector
          v-model="toAsset"
          :assets="availableToAssets"
        />
      </div>
    </div>

    <!-- Trade Preview -->
    <TradePreview
      v-if="canShowPreview"
      :preview="tradePreview"
      class="mt-4"
    />

    <!-- Action Button -->
    <UButton
      block
      size="lg"
      :color="canTrade ? 'primary' : 'gray'"
      :disabled="!canTrade"
      class="mt-4 rounded-xl bg-purple-600 hover:bg-purple-700"
      @click="executeTrade"
    >
      {{ tradeButtonText }}
    </UButton>

    <!-- Settings Modal -->
    <UModal v-model="showSettings">
      <UCard class="bg-gray-900">
        <template #header>
          <h3 class="text-xl font-semibold text-white">Settings</h3>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Slippage Tolerance
            </label>
            <UInput
              v-model="settings.slippage"
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              suffix="%"
              class="bg-gray-800"
            />
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Asset } from '~/types/asset'
import { useAssetsStore } from '~/stores/assets'
import { useTradingStore } from '~/stores/trading'

const amount = ref(0)
const fromAsset = ref<Asset | null>(null)
const toAsset = ref<Asset | null>(null)
const showSettings = ref(false)
const settings = ref({
  slippage: 0.5
})

const assetsStore = useAssetsStore()
const tradingStore = useTradingStore()

const availableFromAssets = computed(() => assetsStore.assets)
const availableToAssets = computed(() => 
  assetsStore.assets.filter(asset => asset.id !== fromAsset.value?.id)
)

const estimatedOutput = computed(() => {
  if (!fromAsset.value || !toAsset.value || amount.value <= 0) return 0
  return amount.value * (toAsset.value.price / fromAsset.value.price)
})

const canShowPreview = computed(() => 
  fromAsset.value && 
  toAsset.value && 
  amount.value > 0
)

const tradePreview = computed(() => {
  if (!fromAsset.value || !toAsset.value) return null

  const rate = toAsset.value.price / fromAsset.value.price
  const priceImpact = amount.value > 0 ? 
    (amount.value / fromAsset.value.balance) * 100 : 0
  
  return {
    fromAsset: fromAsset.value,
    toAsset: toAsset.value,
    rate,
    priceImpact,
    fee: 0.001 * amount.value * fromAsset.value.price,
    minReceived: estimatedOutput.value * (1 - settings.value.slippage / 100)
  }
})

const canTrade = computed(() => 
  fromAsset.value &&
  toAsset.value &&
  amount.value > 0 &&
  amount.value <= fromAsset.value.balance
)

const tradeButtonText = computed(() => {
  if (!fromAsset.value || !toAsset.value) return 'Select tokens'
  if (amount.value <= 0) return 'Enter amount'
  if (fromAsset.value && amount.value > fromAsset.value.balance) {
    return 'Insufficient balance'
  }
  return 'Get started'
})

const swapDirection = () => {
  [fromAsset.value, toAsset.value] = [toAsset.value, fromAsset.value]
  amount.value = 0
}

const executeTrade = () => {
  if (!canTrade.value || !tradePreview.value) return
  
  tradingStore.executeTrade({
    fromAsset: fromAsset.value!,
    toAsset: toAsset.value!,
    amount: amount.value,
    minReceived: tradePreview.value.minReceived
  })
  
  amount.value = 0
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}
</script>
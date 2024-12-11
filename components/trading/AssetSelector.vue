<template>
  <UPopover :popper="{ placement: 'bottom-end' }">
    <UButton
      color="gray"
      variant="ghost"
      class="min-w-[140px] h-[42px] bg-gray-800 hover:bg-gray-700"
    >
      <template v-if="selectedAsset">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
            {{ selectedAsset.symbol.slice(0, 2) }}
          </div>
          <span class="font-medium">{{ selectedAsset.symbol }}</span>
        </div>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2" />
      </template>
      <template v-else>
        <span>Select Token</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="ml-2" />
      </template>
    </UButton>

    <template #panel="{ close }">
      <div class="w-80 p-4 bg-gray-900 rounded-xl">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search token"
          class="mb-4"
        />
        
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <UButton
            v-for="asset in filteredAssets"
            :key="asset.id"
            block
            color="gray"
            variant="ghost"
            class="justify-between hover:bg-gray-800"
            @click="selectAsset(asset, close)"
          >
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                {{ asset.symbol.slice(0, 2) }}
              </div>
              <div class="text-left">
                <div class="font-medium">{{ asset.symbol }}</div>
                <div class="text-xs text-gray-400">{{ asset.type }}</div>
              </div>
            </div>
            <div class="text-right">
              <div>{{ formatNumber(asset.balance) }}</div>
              <div class="text-xs text-gray-400">
                ≈ ${{ formatNumber(asset.balance * asset.price) }}
              </div>
            </div>
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Asset } from '~/types/asset'

const props = defineProps<{
  modelValue?: Asset
  assets: Asset[]
}>()

const emit = defineEmits(['update:modelValue'])

const search = ref('')

const filteredAssets = computed(() => {
  const searchTerm = search.value.toLowerCase()
  return props.assets.filter(asset => 
    asset.symbol.toLowerCase().includes(searchTerm) ||
    asset.name.toLowerCase().includes(searchTerm)
  )
})

const selectedAsset = computed(() => props.modelValue)

const selectAsset = (asset: Asset, close: () => void) => {
  emit('update:modelValue', asset)
  close()
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}
</script>
<template>
  <div class="max-w-xl mx-auto px-4">
    <UCard>
      <template #header>
        <h1 class="text-xl font-semibold">Mint New Asset</h1>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Asset Type -->
        <UFormGroup
          label="Asset Type"
          required
        >
          <USelect
            v-model="form.type"
            :options="assetTypes"
            placeholder="Select asset type"
          />
        </UFormGroup>

        <!-- Asset Name -->
        <UFormGroup
          label="Asset Name"
          required
        >
          <UInput
            v-model="form.name"
            placeholder="Enter asset name"
          />
        </UFormGroup>

        <!-- Asset Symbol -->
        <UFormGroup
          label="Asset Symbol"
          required
        >
          <UInput
            v-model="form.symbol"
            placeholder="Enter asset symbol"
            class="uppercase"
          />
        </UFormGroup>

        <!-- Initial Supply -->
        <UFormGroup
          label="Initial Supply"
          required
        >
          <UInput
            v-model="form.supply"
            type="number"
            min="0"
            step="0.000001"
            placeholder="Enter initial supply"
          />
        </UFormGroup>

        <!-- Mint Parameters -->
        <div v-if="form.type" class="space-y-4">
          <h3 class="font-medium">Mint Parameters</h3>
          
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Network Fee</span>
              <span>{{ formatPrice(calculateFee()) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">Estimated Time</span>
              <span>~2 minutes</span>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <UButton
          type="submit"
          block
          :loading="isLoading"
          :disabled="!isValid"
          class="bg-purple-600 hover:bg-purple-700"
        >
          Mint Asset
        </UButton>
      </form>

      <!-- Success Modal -->
      <UModal v-model="showSuccessModal">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-heroicons-check-circle"
                class="text-green-500 w-6 h-6"
              />
              <h3 class="text-xl font-semibold">Asset Minted Successfully</h3>
            </div>
          </template>

          <div class="space-y-4">
            <p>Your new asset has been minted successfully:</p>
            
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Name</span>
                <span class="font-medium">{{ form.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Symbol</span>
                <span class="font-medium">{{ form.symbol }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Type</span>
                <span class="font-medium">{{ form.type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Supply</span>
                <span class="font-medium">{{ formatNumber(Number(form.supply)) }}</span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                to="/assets"
                color="gray"
              >
                View Assets
              </UButton>
              <UButton
                @click="resetForm"
                class="bg-purple-600 hover:bg-purple-700"
              >
                Mint Another
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAssetsStore } from '~/stores/assets'
import { formatPrice } from '~/utils/price'

const assetsStore = useAssetsStore()
const router = useRouter()

const assetTypes = ['SAT20', 'BRC20', 'RUNE']
const form = ref({
  type: '',
  name: '',
  symbol: '',
  supply: ''
})

const isLoading = ref(false)
const showSuccessModal = ref(false)

const isValid = computed(() => 
  form.value.type &&
  form.value.name.length >= 2 &&
  form.value.symbol.length >= 2 &&
  Number(form.value.supply) > 0
)

const calculateFee = () => {
  if (!form.value.type || !form.value.supply) return 0
  const baseRate = {
    'SAT20': 0.001,
    'BRC20': 0.0015,
    'RUNE': 0.0005
  }[form.value.type] || 0
  
  return baseRate * Number(form.value.supply)
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6
  }).format(value)
}

const handleSubmit = async () => {
  if (!isValid.value) return
  
  isLoading.value = true
  
  try {
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Add new asset to store
    assetsStore.assets.push({
      id: (assetsStore.assets.length + 1).toString(),
      type: form.value.type,
      name: form.value.name,
      symbol: form.value.symbol.toUpperCase(),
      balance: Number(form.value.supply),
      price: 0.1 // Initial price
    })
    
    showSuccessModal.value = true
  } catch (error) {
    console.error('Minting failed:', error)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  form.value = {
    type: '',
    name: '',
    symbol: '',
    supply: ''
  }
  showSuccessModal.value = false
}
</script>
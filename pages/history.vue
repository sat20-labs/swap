<template>
  <div class="max-w-7xl mx-auto px-4">
    <UCard>
      <template #header>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 class="text-xl font-semibold">Transaction History</h1>
          
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <USelect
              v-model="filters.type"
              :options="transactionTypes"
              option-attribute="label"
              placeholder="Filter by type"
              class="w-40"
              clearable
            />
            
            <USelect
              v-model="filters.asset"
              :options="availableAssets"
              placeholder="Filter by asset"
              class="w-40"
              clearable
            />
            
            <UPopover>
              <UButton
                color="gray"
                variant="soft"
                trailing-icon="i-heroicons-calendar"
              >
                {{ dateRangeText }}
              </UButton>

              <template #panel>
                <div class="p-4 space-y-4">
                  <UFormGroup label="Start Date">
                    <UInput
                      v-model="filters.startDate"
                      type="date"
                    />
                  </UFormGroup>
                  <UFormGroup label="End Date">
                    <UInput
                      v-model="filters.endDate"
                      type="date"
                    />
                  </UFormGroup>
                </div>
              </template>
            </UPopover>
          </div>
        </div>
      </template>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">From</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">To</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Amount</th>
              <th class="px-4 py-3 text-right text-sm font-semibold">Fee</th>
              <th class="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th class="px-4 py-3 text-center text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="tx in displayedTransactions"
              :key="tx.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td class="px-4 py-4 text-sm">
                <UBadge
                  :color="getTransactionTypeColor(tx.type)"
                  variant="subtle"
                  size="sm"
                >
                  {{ getTransactionTypeLabel(tx.type) }}
                </UBadge>
              </td>
              <td class="px-4 py-4 text-sm">
                {{ tx.fromAmount }} {{ tx.fromAsset }}
              </td>
              <td class="px-4 py-4 text-sm">
                {{ tx.toAmount }} {{ tx.toAsset }}
              </td>
              <td class="px-4 py-4 text-sm text-right">
                {{ formatPrice(tx.toAmount * getAssetPrice(tx.toAsset)) }}
              </td>
              <td class="px-4 py-4 text-sm text-right">
                {{ formatPrice(tx.fee) }}
              </td>
              <td class="px-4 py-4 text-sm">
                {{ formatDate(tx.timestamp) }}
              </td>
              <td class="px-4 py-4">
                <UBadge
                  :color="getStatusColor(tx.status)"
                  variant="subtle"
                  size="sm"
                  class="mx-auto"
                >
                  {{ tx.status }}
                </UBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <template #footer>
        <div class="flex justify-between items-center">
          <p class="text-sm text-gray-500">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTransactions.length }} transactions
          </p>
          <UPagination
            v-model="currentPage"
            :total="filteredTransactions.length"
            :per-page="perPage"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionsStore } from '~/stores/transactions'
import { useAssetsStore } from '~/stores/assets'
import { formatPrice } from '~/utils/price'
import type { TransactionType } from '~/types/transaction'

const transactionsStore = useTransactionsStore()
const assetsStore = useAssetsStore()

const filters = ref({
  type: null as TransactionType | null,
  asset: null as string | null,
  startDate: null as string | null,
  endDate: null as string | null
})

const currentPage = ref(1)
const perPage = 10

const transactionTypes = [
  { value: 'SWAP', label: 'Swap' },
  { value: 'ADD_LIQUIDITY', label: 'Add Liquidity' },
  { value: 'REMOVE_LIQUIDITY', label: 'Remove Liquidity' },
  { value: 'MINT', label: 'Mint' }
]

const availableAssets = computed(() => 
  Array.from(new Set(transactionsStore.transactions.flatMap(tx => [tx.fromAsset, tx.toAsset])))
)

const filteredTransactions = computed(() => {
  let filtered = transactionsStore.transactions
  
  if (filters.value.type) {
    filtered = filtered.filter(tx => tx.type === filters.value.type)
  }
  
  if (filters.value.asset) {
    filtered = filtered.filter(tx => 
      tx.fromAsset === filters.value.asset || 
      tx.toAsset === filters.value.asset
    )
  }
  
  if (filters.value.startDate) {
    const start = new Date(filters.value.startDate).getTime()
    filtered = filtered.filter(tx => tx.timestamp >= start)
  }
  
  if (filters.value.endDate) {
    const end = new Date(filters.value.endDate).getTime() + 86400000 // Include full day
    filtered = filtered.filter(tx => tx.timestamp <= end)
  }
  
  return filtered
})

const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => Math.min(startIndex.value + perPage, filteredTransactions.value.length))

const displayedTransactions = computed(() => 
  filteredTransactions.value.slice(startIndex.value, endIndex.value)
)

const dateRangeText = computed(() => {
  if (!filters.value.startDate && !filters.value.endDate) return 'Filter by date'
  if (filters.value.startDate && filters.value.endDate) {
    return `${filters.value.startDate} - ${filters.value.endDate}`
  }
  return filters.value.startDate || filters.value.endDate
})

const getTransactionTypeLabel = (type: TransactionType) => {
  return transactionTypes.find(t => t.value === type)?.label || type
}

const getTransactionTypeColor = (type: TransactionType) => {
  switch (type) {
    case 'SWAP': return 'blue'
    case 'ADD_LIQUIDITY': return 'green'
    case 'REMOVE_LIQUIDITY': return 'yellow'
    case 'MINT': return 'purple'
    default: return 'gray'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'green'
    case 'pending': return 'yellow'
    case 'failed': return 'red'
    default: return 'gray'
  }
}

const getAssetPrice = (symbol: string) => {
  return assetsStore.assets.find(asset => asset.symbol === symbol)?.price || 0
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString()
}
</script>
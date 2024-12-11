<template>
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink 
          to="/" 
          class="text-gray-900 dark:text-white font-bold text-xl flex items-center gap-2"
        >
          <UIcon
            name="i-heroicons-cube-transparent"
            class="w-8 h-8 text-purple-600"
          />
          <span>DEX</span>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-1">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              isCurrentRoute(link.to)
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="link.icon"
                class="w-5 h-5"
              />
              {{ link.label }}
            </div>
          </NuxtLink>
        </div>

        <!-- Right Section -->
        <div class="flex items-center gap-4">
          <ThemeSwitcher />
          
          <!-- Mobile Menu Button -->
          <UButton
            color="gray"
            variant="ghost"
            class="md:hidden"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
          >
            <UIcon
              :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
              class="w-6 h-6"
            />
          </UButton>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden border-t border-gray-200 dark:border-gray-700"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink
            v-for="link in navigationLinks"
            :key="link.to"
            :to="link.to"
            class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
            :class="[
              isCurrentRoute(link.to)
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            @click="isMobileMenuOpen = false"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="link.icon"
                class="w-5 h-5"
              />
              {{ link.label }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const navigationLinks = [
  {
    label: 'Trade',
    to: '/swap',
    icon: 'i-heroicons-arrows-right-left'
  },
  {
    label: 'Pools',
    to: '/pools',
    icon: 'i-heroicons-circle-stack'
  },
  {
    label: 'Assets',
    to: '/assets',
    icon: 'i-heroicons-banknotes'
  },
  {
    label: 'History',
    to: '/history',
    icon: 'i-heroicons-clock'
  },
  {
    label: 'Mint',
    to: '/mint',
    icon: 'i-heroicons-plus-circle'
  }
]

const isCurrentRoute = (path: string) => {
  return route.path === path || 
    (path === '/swap' && route.path === '/')
}
</script>
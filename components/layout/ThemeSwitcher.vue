<template>
  <UDropdown
    :items="themes"
    :popper="{ placement: 'bottom-end' }"
  >
    <UButton
      color="gray"
      variant="ghost"
      class="flex items-center gap-2"
    >
      <UIcon
        :name="currentThemeIcon"
        class="w-5 h-5"
      />
    </UButton>

    <template #item="{ item }">
      <div class="flex items-center gap-2">
        <UIcon
          :name="item.icon"
          class="w-5 h-5 flex-shrink-0"
        />
        <span>{{ item.label }}</span>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorMode = useColorMode()

const themes = [
  {
    label: 'Light',
    icon: 'i-heroicons-sun',
    click: () => colorMode.preference = 'light'
  },
  {
    label: 'Dark',
    icon: 'i-heroicons-moon',
    click: () => colorMode.preference = 'dark'
  },
  {
    label: 'System',
    icon: 'i-heroicons-computer-desktop',
    click: () => colorMode.preference = 'system'
  }
]

const currentThemeIcon = computed(() => {
  switch (colorMode.preference) {
    case 'light':
      return 'i-heroicons-sun'
    case 'dark':
      return 'i-heroicons-moon'
    default:
      return 'i-heroicons-computer-desktop'
  }
})
</script>
<script setup lang="ts">
import { inject, type WritableComputedRef } from 'vue'

defineProps<{
  value: string
}>()

const activeTab = inject<WritableComputedRef<string>>('activeTab')!
</script>

<template>
  <button
    :class="[
      'inline-flex flex-1 items-center justify-center rounded-xl border border-transparent px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors',
      activeTab === value
        ? 'bg-card text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground'
    ]"
    @click="activeTab = value"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject, type WritableComputedRef } from 'vue'

defineProps<{
  value: string
}>()

const activeTab = inject<WritableComputedRef<string>>('activeTab')!
</script>

<template>
  <div v-if="activeTab === value" class="flex-1 outline-none">
    <slot />
  </div>
</template>

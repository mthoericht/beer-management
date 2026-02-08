<template>
  <Card>
    <div class="px-6 pt-6 pb-2">
      <div class="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <slot name="icon" />
        {{ label }}
      </div>
    </div>
    <div class="px-6 pb-6">
      <div class="text-3xl font-bold" :class="valueClass">{{ value }}</div>
      <p class="text-xs text-muted-foreground mt-1">{{ subtitle }}</p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue'

defineProps<{
  label: string
  value: string | number
  subtitle: string
  valueClass?: string
}>()
</script>

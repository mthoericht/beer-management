<script setup lang="ts">
defineProps<{
  forId?: string
}>()
</script>

<template>
  <label :for="forId" class="block text-sm font-medium text-muted-foreground">
    <slot />
  </label>
</template>

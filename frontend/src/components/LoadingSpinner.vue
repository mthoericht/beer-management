<template>
  <div class="min-h-screen bg-background flex items-center justify-center" role="status" aria-live="polite">
    <div class="text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      <p class="mt-4 text-muted-foreground">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: 'Loading beers...' })
</script>

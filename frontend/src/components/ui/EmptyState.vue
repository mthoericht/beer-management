<template>
  <div class="text-center py-12">
    <slot name="icon">
      <BeerIcon size="64" icon-class="text-muted-foreground mx-auto mb-4" />
    </slot>
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-muted-foreground" v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import BeerIcon from '../icons/BeerIcon.vue'

defineProps<{ title: string; message?: string }>()
</script>

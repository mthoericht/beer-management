<script setup lang="ts">
defineProps<{
  open: boolean
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/80" @click="$emit('close')" />
      <div class="relative z-50 w-full max-w-[500px] mx-4 rounded-xl border border-border bg-card p-6 shadow-lg">
        <button
          @click="$emit('close')"
          class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 text-muted-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

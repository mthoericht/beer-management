<template>
  <header class="border-b bg-card">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <BeerIcon size="32" icon-class="text-amber-600" />
          <div>
            <h1 class="text-3xl font-bold">Beer Management</h1>
            <p class="text-sm text-muted-foreground">Manage your beer list</p>
          </div>
        </div>
        <Button size="lg" @click="$emit('add-beer')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Beer
        </Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import BeerIcon from '../icons/BeerIcon.vue'
import Button from '../ui/Button.vue'

defineEmits<{ 'add-beer': [] }>()
</script>

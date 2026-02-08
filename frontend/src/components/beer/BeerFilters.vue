<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div class="relative flex-1">
      <SearchIcon size="16" icon-class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        :model-value="searchQuery"
        @update:model-value="$emit('update:searchQuery', String($event))"
        placeholder="Search beer, brewery or style..."
        class="pl-10"
      />
    </div>

    <Select :model-value="filterStatus" @update:model-value="$emit('update:filterStatus', String($event ?? ''))" class="w-full md:w-[200px]">
      <option value="all">All Beers</option>
      <option value="drank">Drank</option>
      <option value="toTry">To Try</option>
    </Select>

    <Select :model-value="sortBy" @update:model-value="$emit('update:sortBy', String($event ?? ''))" class="w-full md:w-[200px]">
      <option value="dateAdded">Date Added</option>
      <option value="name">Name</option>
      <option value="rating">Rating</option>
    </Select>
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '../icons/SearchIcon.vue'
import Input from '../ui/Input.vue'
import Select from '../ui/Select.vue'

defineProps<{
  searchQuery: string
  filterStatus: string
  sortBy: string
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:sortBy': [value: string]
}>()
</script>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    defaultValue?: string
    modelValue?: string
  }>(),
  {
    defaultValue: '',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const internalValue = ref(props.defaultValue)

const activeTab = computed({
  get: () => props.modelValue ?? internalValue.value,
  set: (val: string) => {
    internalValue.value = val
    emit('update:modelValue', val)
  },
})

provide('activeTab', activeTab)
</script>

<template>
  <div class="flex flex-col gap-6">
    <slot />
  </div>
</template>

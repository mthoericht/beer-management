<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    size: 'md',
    type: 'button',
  }
)

const classes = computed(() => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
  const variants: Record<ButtonVariant, string> = {
    default: 'bg-primary text-primary-foreground hover:opacity-90',
    outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    ghost: 'text-foreground hover:bg-muted',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
  }
  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4',
    lg: 'h-11 px-6 text-base',
  }

  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>

<template>
  <button :type="props.type" :class="classes">
    <slot />
  </button>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    count?: number
  }>(),
  {
    title: 'Default Title',
    count: 0,
  }
)

defineEmits<{
  confirm: [value: number]
  cancel: [reason: string]
}>()
</script>

<template>
  <div class="typed-dialog">{{ title }}: {{ count }}</div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Default Title',
    message: 'Default Message',
  }
)

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div>
    <p>{{ title }}: {{ message }}</p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

defineProps({
  show: Boolean,
  msg: {
    type: String,
    default: 'Modal Dialog',
  },
})

const emit = defineEmits(['confirm', 'cancel'])

// const msg = ref('Modal Dialog')
</script>

<template>
  <div v-if="show">
    <h1>{{ msg }}</h1>

    <button @click="emit('confirm', true)">Confirm</button><br />
    <button @click="emit('cancel', false)">Cancel</button>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>

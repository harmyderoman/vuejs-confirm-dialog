<template>
  <div v-if="overlay" class="vcd-modal-overlay" @click="emit('click-outside')">
  </div>

  <div class="vcd-modal-box" :class="class">
    <slot />
  </div>
</template>

<script setup lang="ts">
// ModalBox - useful component for building modal dialogs
// Features:
// Transitions
// Focus trap
// Scroll lock
// Overlay true/false
// Close on click outside true/false 

defineProps({
  overlay: Boolean,
  focusTrap: Boolean,
  scrolLock: Boolean,
  transition: {
    type: String,
    default: 'fade'
  },
  class: String
})

const emit = defineEmits(['click-outside'])

</script>

<style>

.vcd-modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #cecece89;
}

.vcd-modal-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%)
}

</style>
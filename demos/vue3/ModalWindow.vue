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
</script>

<template>
  <div v-if="show" class="my-modal">
    <div class="modal-box">
      <p>{{ msg }}</p>
      <div class="modal-action">
        <button class="btn btn-primary" @click="emit('confirm', true)">
          Confirm
        </button>
        <button class="btn" @click="emit('cancel', false)">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style>
.my-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  --tw-bg-opacity: 0.4;
  background-color: hsla(var(--nf) / var(--tw-bg-opacity, 1));
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 0.15s;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

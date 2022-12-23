<script setup lang="ts">
import ModalBox from '../../../src/ModalBox.vue'

defineProps({
  msg: {
    type: String,
    default: 'The default dialog message',
  },
})

const emit = defineEmits(['confirm', 'cancel']) // must emits
</script>

<template>
  <ModalBox overlay class="modal-box fix-transform" @click-outside="emit('cancel')">
      <p>{{ msg }}</p>
      <div class="modal-action">
        <button class="btn btn-primary" @click="emit('confirm')">
          Confirm
        </button>
        <button class="btn" @click="emit('cancel')">Cancel</button>
      </div>
  </ModalBox>
</template>

<style>
.fix-transform {
  transform: translate(-50%, -50%)!important;
}
</style>


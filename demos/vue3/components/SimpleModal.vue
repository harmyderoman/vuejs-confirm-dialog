<script setup lang="ts">
defineProps({
  //show: Boolean, // no longer need `show` prop and `v-if` on template
  msg: {
    type: String,
    default: 'The modal dialog message',
  },
})

const emit = defineEmits(['confirm', 'cancel']) // must emits
</script>

<template>
  <div class="my-modal"  @click.self="emit('cancel')">
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
  background-color: #cecece89;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 0.15s;
  transition-duration: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}
</style>

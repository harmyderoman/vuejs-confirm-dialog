<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    default: 'This modal fades and scales in/out via <TransitionGroup>',
  },
})

const emit = defineEmits(['confirm', 'cancel']) // must emits
</script>

<template>
  <div class="transition-modal" @click.self="emit('cancel')">
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
.transition-modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #cecece89;
  z-index: 100;
}

/* The library wraps every dialog in <TransitionGroup> with no default
   `name`, so these are Vue's default transition classes - just add
   matching CSS on your modal's root element, no extra setup needed. */
.transition-modal.v-enter-active,
.transition-modal.v-leave-active {
  transition: opacity 0.3s ease;
}
.transition-modal.v-enter-active .modal-box,
.transition-modal.v-leave-active .modal-box {
  transition: transform 0.3s ease;
}
.transition-modal.v-enter-from,
.transition-modal.v-leave-to {
  opacity: 0;
}
.transition-modal.v-enter-from .modal-box,
.transition-modal.v-leave-to .modal-box {
  transform: scale(0.85);
}
</style>

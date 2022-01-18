<script lang="ts" setup>
import ModalWindow from './ModalWindow.vue' // your modal component
import { createConfirmDialog } from '../../src/index' // `...from 'vuejs-create-dialog'` if you are using the package
import DialogsWrapper from '../../src/DialogsWrapper.vue' // same
import { ref } from 'vue'
import { debouncedWatch } from '@vueuse/core'

const defaultMessage = 'To prompt Modal Dialog press one of the buttons below:'
const message = ref(defaultMessage)

// Example how to use `createConfirmDialog` with hooks
// pass your modal component to the function
const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalWindow)
onConfirm(() => {
  message.value = 'Confirmed!'
})
onCancel(() => {
  message.value = 'Canceled!'
})

// Example how to use it in Promise style
// We are reusing the same component
// You need to rename `reveal` to avoid conflict with the first usage
// Pass new props of modal component in a second argument if you need to
const { reveal: reveal2 } = createConfirmDialog(ModalWindow, {
  msg: 'Modal #2',
})

// Build an async function to use it in a template
const showDialog = async () => {
  const { data, isCanceled } = await reveal2({ msg: 'New Message!' }) // pass new props to modal component
  if (!isCanceled) message.value = 'Confirmed dialog #2!'
  else message.value = 'Canceled dialog #2!'
}

// Reset message after 2000 ms
debouncedWatch(
  message,
  () => {
    message.value = defaultMessage
  },
  { debounce: 2000 }
)
</script>

<template>
  <div class="card shadow-xl">
    <div class="justify-end card-body">
      <h1 class="card-title">Hi!</h1>
      <p class="text-error">{{ message }}</p>
      <div class="card-actions">
        <button class="btn btn-primary" @click="reveal">Dialog</button>
        <button class="btn btn-secondary" @click="showDialog">Dialog 2</button>
      </div>
    </div>
  </div>

  <!-- put it in the template of your App.vue file to make this library work -->
  <DialogsWrapper />
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/daisyui@1.19.0/dist/full.css';
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css';
</style>

<script lang="ts" setup>
import ModalWindow from './components/SimpleModal.vue' // your modal component
import { useAlertMessage } from './composables/useAlertMessage'
import Loader from './components/Loader.vue'
import { createConfirmDialog } from '../../src/index' // `...from 'vuejs-create-dialog'` if you are using the package
// import DialogsWrapper from '../../src/index' // optional, add this import if you didn't install the plugin
import { ref } from 'vue'
import { debouncedWatch } from '@vueuse/core'

import { useLoader } from './composables/useLoader'


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

// For reusing component just call `reveal` again and pass to it object of props.
const reuse = () => {
  reveal({ msg: 'Reuse Modal Component' })
}

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

// Alert Message
const showAlert = useAlertMessage()

// Reset message after 2000 ms
debouncedWatch(
  message,
  () => {
    message.value = defaultMessage
  },
  { debounce: 2000 }
)

// Loader Component
const fetchData = () => {
  // Here go your API Call, I tested it with promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Loading data is finished!')
    }, 2000)
  })
}

const loader = useLoader(fetchData)

loader.onLoaded((data) => {
  message.value = data
})
</script>

<template>
  <div class="card shadow-xl">
    <div class="justify-end card-body">
      <h1 class="card-title">Hi!</h1>
      <p class="text-error">{{ message }}</p>
      <div class="card-actions">
        <button class="btn btn-primary" @click="reveal">Dialog</button>
        <button class="btn btn-secondary" @click="showDialog">Dialog 2</button>
        <button class="btn btn-error" @click="showAlert('Yes!')">Alert!</button>
        <button class="btn btn-secondary" @click="loader.start">Load Data</button>
      </div>
    </div>
  </div>

  <!-- put it in the template of your App.vue file to make this library work -->
  <div class="alerts-container">
    <DialogsWrapper />
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/daisyui@1.19.0/dist/full.css';
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css';

.alerts-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 5px;
    top: 20px;
    right: 40px;
    width: 380px;
}
</style>

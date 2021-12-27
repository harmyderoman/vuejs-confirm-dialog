<script setup>
import ModalWindow from './ModalWindow.vue'
import { ref } from 'vue'

import { createConfirmDialog } from '../../src/index'
import DialogsWrapper from '../../src/DialogsWrapper.vue'
// import { reactive, shallowRef } from 'vue'
const show = ref(true)
const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalWindow)
const { reveal: showDialog2, onConfirm: onConfirm2 } = createConfirmDialog(
  ModalWindow,
  {
    msg: 'Modal N2',
  }
)
onConfirm2(() => {
  console.log('Confirmed 2!')
})
onConfirm(() => {
  console.log('Confirmed!')
})
onCancel(() => {
  console.log('Canceled!')
})
const showDialog = async () => {
  const { data, isCanceled } = await reveal({ msg: 'New Msg!' })
  if (!isCanceled) console.log('Confirmed!')
  else console.log('Canceled!')
}
</script>

<template>
  <div class="card shadow-xl">
    <div class="justify-end card-body">
      <h1 class="card-title">Hello!</h1>
      <p>For prompt Modal Dialog press one of the buttons below</p>
      <div class="card-actions">
        <button class="btn btn-primary" @click="showDialog">Dialog</button>
        <button class="btn btn-secondary" @click="showDialog2">Dialog 2</button>
      </div>
    </div>
  </div>
  <DialogsWrapper />
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/daisyui@1.19.0/dist/full.css';
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css';
</style>

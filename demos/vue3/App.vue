<script setup>
import ModalWindow from './ModalWindow.vue'

import { create } from '../../src/index'
import DialogsWrapper from '../../src/DialogsWrapper.vue'
// import { reactive, shallowRef } from 'vue'

const { reveal, onConfirm, onCancel } = create(ModalWindow)
const { reveal: showDialog2 } = create(ModalWindow, {
  msg: 'Modal N2',
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
  <h1>Hello</h1>
  <button @click="showDialog">Dialog</button>
  <button @click="showDialog2">Dialog 2</button>
  <DialogsWrapper />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

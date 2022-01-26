# vuejs-confirm-dialog

A library for creating reusable dialogs in Vue 3. Made with Composition API.
Powered by `vue-demi`, so you can use it in Vue 2, but this required `@vue/composition-api` >= v1.1

> ⚠️  Warning! Work in progress. Don't use it in production! Breaking changes may occur!

## About

This is a library for creating reusable dialogs. It takes your modal component and builds a structure for dialogs that wait for user confirmation. You can work with it like with promises or work with dialog hooks that the library generates for you.

## Installation

```bash
npm i vuejs-confirm-dialog
```

Install the plugin:

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import * as ConfirmDialog from 'vuejs-confirm-dialog'

createApp(App).use(ConfirmDialog).mount('#app')
```

Add `DialodsWrapper` to `App.vue`:

```html
//App.vue
<template>
  <div class="app">
  </div>

  <!-- put it in the template of your App.vue file to make this library work -->
  <!-- Don't need import the component, if you installed the plugin -->
  <DialogsWrapper />
</template>
```

## Usage

Build Modal Window. It must contain prop `show` and emits `confirm` and `cancel`. Put `v-if="show"` in its template for conditional rendering.

```html
<!-- ModalWindow.vue -->
<script setup>
  defineProps({
    show: Boolean,
  })

  const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="show">
    <!-- Some message -->
    <button @click="emit('confirm', true)">Confirm</button><br />
    <button @click="emit('cancel', false)">Cancel</button>
  </div>
</template>
```

Use this modal window wherever you want in your project:

```html
<script setup>
import ModalWindow from 'path/to/ModalWindow.vue'
import { createConfirmDialog } from 'vuejs-create-dialog'

const { reveal, onConfirm } = createConfirmDialog(ModalWindow)

reveal()

onConfirm(() => {
  console.log('Confirmed!')
})
</script>
```

Check this full Vue 3 [example](https://github.com/harmyderoman/vuejs-confirm-dialog/blob/main/demos/vue3).

## Demo

Clone the project and run the following command to see the demo:

```bash
pnpm run demo
```

Demo is styled by beautiful [daisyUI](https://daisyui.com/).

## Thanks

Inspired by [`Vueuse`](https://github.com/vueuse/vueuse) and [`vue-modal-dialogs`](https://github.com/hjkcai/vue-modal-dialogs). Thanks to all contributors to these projects ❤️!

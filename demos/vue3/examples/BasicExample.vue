<script lang="ts" setup>
  import { createConfirmDialog } from './../../../src/index' // from 'vuejs-confirm-dialog' if using package
  import SimpleModal from './../components/SimpleModal.vue'
  import { ref } from 'vue'
  import { debouncedWatch } from '@vueuse/core';

  const defaultMessage = 'Open Dialog and confirm action'
  const message = ref(defaultMessage)

  const { reveal, onConfirm, onCancel } = createConfirmDialog(SimpleModal)

  // Callback inside this hook will be called if the user confirms the dialog 
  onConfirm(() => {
    message.value = 'Confirmed!'
  })

  // This will be called on canceling
  onCancel(() => {
    message.value = 'Canceled!'
  })

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
  <h2 class="card-title">Basic Example</h2>
  <p>
    This is the basic example of how to use this package:
  </p>

  <div class="card shadow-xl mt-4 mb-4">
      <div class="justify-end card-body">
        <p class="card-title">Dialog status: 
          <span class="text-error">{{ message }}</span>
        </p>
        <button class="btn btn-primary" @click="reveal()">Open Dialog</button>
      </div>
  </div>

  <p>This is how it is implemented in code:</p>
  <p>
    <a class="link link-primary" href="https://github.com/harmyderoman/vuejs-confirm-dialog/blob/main/demos/vue3/examples/BasicExample.vue">
      Basic Example
    </a>
  </p>

  <div class="divider"></div>
</template>
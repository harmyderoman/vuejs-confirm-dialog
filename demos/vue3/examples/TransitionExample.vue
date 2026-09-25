<script lang="ts" setup>
  import { createConfirmDialog } from './../../../src/index' // from 'vuejs-confirm-dialog' if using package
  import TransitionModal from './../components/TransitionModal.vue'
  import { ref } from 'vue'
  import { debouncedWatch } from '@vueuse/core';

  const defaultMessage = 'Open the dialog to see the fade/scale exit transition'
  const message = ref(defaultMessage)
  const { reveal, onConfirm, onCancel } = createConfirmDialog(TransitionModal)

  onConfirm(() => {
    message.value = 'Confirmed!'
  })
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
  <h2 class="card-title">Transition Example</h2>
  <p>
    Dialogs are rendered through Vue's <code class="inline-code">&lt;TransitionGroup&gt;</code>,
    so CSS transition classes on your modal's root element are picked up automatically
    for enter/leave animations - no extra setup required.
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
    <a class="link link-primary" href="https://github.com/harmyderoman/vuejs-confirm-dialog/blob/main/demos/vue3/examples/TransitionExample.vue">
      Transition Example
    </a>
  </p>

  <div class="divider"></div>
</template>

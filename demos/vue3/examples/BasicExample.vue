<script lang="ts" setup>
  import { createConfirmDialog } from './../../../src/index' 
  import ModalWindow from './../components/SimpleModal.vue'
  import { ref } from 'vue'
  import { debouncedWatch } from '@vueuse/core';

  const defaultMessage = 'Not set'
  const message = ref(defaultMessage)

  const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalWindow)
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
  <h2 class="card-title">Basic Example</h2>
  <p>
    This is the basic example of how to use this package:
  </p>

  <div class="card shadow-xl mt-4 mb-4">
      <div class="justify-end card-body">
        <p class="card-title">Dialog status: 
          <span class="text-error">{{ message }}</span>
        </p>
        <button class="btn btn-primary" @click="reveal">Open Dialog</button>
      </div>
  </div>

  <p>This is how it is implemented in code:</p>

  <pre class="card code-card mt-4 mb-4">
    <code>
        // script lang="ts" setup

        import { createConfirmDialog } from 'vuejs-confirm-dialog'
        import ModalWindow from './SimpleModal.vue'
        import { ref } from 'vue'

        const defaultMessage = 'not set'
        const message = ref(defaultMessage)

        const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalWindow)
        onConfirm(() => {
          message.value = 'Confirmed!'
        })
        onCancel(() => {
          message.value = 'Canceled!'
        })
    </code>
  </pre>

  <p>
    Import <code class="inline-code">vuejs-create-dialog</code> if you are using the package.
    Pass your modal component to the function.
    Also mport DialogsWrapper if you didn't install the plugin.
  </p>

  <p>Template:</p> 

  <pre class="card code-card mt-4 mb-4">
    <code>
      &lt;div&gt;
        &lt;p&gt;Dialog status: 
          &lt;span&gt; &#123;&#123; message &#125;&#125; &lt;/span&gt;&lt;/p&gt;
        &lt;button @click="reveal"&gt;Open Dialog&lt;/button&gt;
      &lt;/div&gt;
    </code>
  </pre>

  <p>Code of Modal Dialog component without css classes:</p>

  <pre class="card code-card mt-4 mb-4">
    <code>
      &lt;script setup lang="ts">
      defineProps({
        msg: {
          type: String,
          default: 'The modal dialog message',
        },
      })

      const emit = defineEmits(['confirm', 'cancel']) // must emits
      &lt;/script>

      &lt;template>
          &lt;div>
            &lt;p>&#123;{ msg }}&lt;/p>
            &lt;div>
              &lt;button @click="emit('confirm', true)">
                Confirm
              &lt;/button>
              &lt;button @click="emit('cancel', false)">
                Cancel
              &lt;/button>
            &lt;/div>
          &lt;/div>
      &lt;/template>
    </code>
  </pre>

  <p>Your modal component have to include follow emits: 
    <code class="inline-code">confirm</code> and 
    <code class="inline-code">cancel</code>
  </p>

  <div class="divider"></div>
</template>
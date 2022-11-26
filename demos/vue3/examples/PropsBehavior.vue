<script lang="ts" setup>
import { createConfirmDialog } from './../../../src/index' // from 'vuejs-confirm-dialog' if using package
import SimpleModal from './../components/SimpleModal.vue'
import { ref } from 'vue'
import { debouncedWatch } from '@vueuse/core'

const defaultMessage = 'Open Dialog and confirm action'
const message = ref(defaultMessage)

const chore = ref(false)
const keepInitial = ref(false)
const initMessage = ref('Initial message!')

let openDialog = ref((_?: any) => {
  message.value = 'Dialogue was not created!'
})

const createDialog = () => {
  const { reveal, onConfirm, onCancel } = createConfirmDialog(
    SimpleModal,
    { msg: initMessage.value },
    { chore: chore.value, keepInitial: keepInitial.value }
  )

  openDialog.value = reveal
  // Callback inside this hook will be called if the user confirms the dialog
  onConfirm(() => {
    message.value = 'Confirmed!'
  })

  // This will be called on canceling
  onCancel(() => {
    message.value = 'Canceled!'
  })
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
  <h2 class="card-title">Props Behavior Config Example</h2>
  <h3>Try different props configurations to see the difference</h3>
  <div>
    <div class="flex flex-row">
      <div class="form-control" style="width: fit-content;">
        <label class="label cursor-pointer flex flex-col items-start gap-2">
          <code>
            { chore:
            <i :style="{ color: chore ? 'hsl(var(--p))': 'hsl(var(--s))'}">
              <code>{{ chore }}</code>
            </i> ,
          </code>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            v-model="chore"
          />
        </label>
      </div>
      <div class="form-control" style="width: fit-content;">
        <label class="label cursor-pointer flex flex-col items-start gap-2">
          <code>
            keepInitial:
            <i :style="{ color: keepInitial ? 'hsl(var(--p))': 'hsl(var(--s))'}">
              <code>{{ keepInitial }}</code>
            </i> }
          </code >
          <input
            type="checkbox"
            class="toggle toggle-accent"
            v-model="keepInitial"
          />
        </label>
      </div>
    </div>
      <div class="form-control w-full max-w-xs mb-2">
        <label class="label">Initial message: </label>
        <input
          type="text"
          v-model="initMessage"
          class="input input-bordered input-error w-full max-w-xs"
        />
      </div>

    <button class="btn btn-accent" @click="createDialog">Create Dialog</button>
  </div>

  <div class="card shadow-xl mt-4 mb-4">
    <div class="justify-end card-body">
      <p class="card-title">
        Dialog status:
        <span class="text-error">{{ message }}</span>
      </p>
      <button class="btn btn-primary" @click="openDialog({ msg: 'Test Message!' })">
        Open Dialog with { msg: 'Test Message!' }
      </button>
      <p>Reuse:</p>
      <button class="btn btn-warning" @click="openDialog()">
        Open Dialog with no new attrs
      </button>
    </div>
  </div>

  <div class="divider"></div>
</template>

<script lang="ts" setup>
import { useAlertMessage } from './../composables/useAlertMessage'
import { ref } from 'vue'

const text = ref('Default Alert Message')

const showAlert = useAlertMessage()
</script>

<template>
  <h2 class="card-title">Alert Example and passing props</h2>
  <p>
    You can use this package to build your own alerts system. Also, you can pass
    props to the dialog component.
  </p>

  <div class="card shadow-xl mt-4 mb-4">
    <div class="justify-end card-body">
      <div class="form-control w-full max-w-xs mb-2">
        <label class="label">Alert message: </label>
        <input
          type="text"
          v-model="text"
          class="input input-bordered input-error w-full max-w-xs"
        />
      </div>

      <button class="btn btn-error mt-2" @click="showAlert(text)">Show Alert</button>
    </div>
  </div>

  <div class="divider"></div>
</template>

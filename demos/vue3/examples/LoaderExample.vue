<script lang="ts" setup>
import { useLoader } from './../composables/useLoader'

import { ref } from 'vue'
const defaultMessage = 'Data is not loaded'
const message = ref(defaultMessage)

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
  <h2 class="card-title">Loader Example</h2>
  <p>
    Example of data loader:
  </p>

  <div class="card shadow-xl mt-4 mb-4">
      <div class="justify-end card-body">
        <p class="card-title">Data status: 
          <span class="text-info">{{ message }}</span>
        </p>
        <button class="btn btn-info" @click="loader.start()">Load Data</button>
      </div>
  </div>

  <div class="divider"></div>
</template>
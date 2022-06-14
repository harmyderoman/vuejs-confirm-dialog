<template>
  <div class="alert shadow-lg alert-error">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current flex-shrink-0 h-6 w-6 mr-2"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span> {{ message }}</span>
    </div>
    <div>
      <span class="close-btn" @click="emit('cancel')">&times;</span>
    </div>
  </div>
</template>

<script setup>
import { useDebounceFn } from '@vueuse/core'

defineProps({
  message: {
    type: String,
    default: 'Error! Task failed successfully.',
  },
})

const emit = defineEmits(['cancel'])

// Remove alert after 2 sec
const hideAlert = useDebounceFn(() => {
  emit('cancel')
}, 3000)
hideAlert()
</script>

<style>
.close-btn {
  margin-left: 15px;
  font-weight: bold;
  float: right;
  font-size: 22px;
  line-height: 20px;
  cursor: pointer;
  transition: 0.3s;
}
</style>


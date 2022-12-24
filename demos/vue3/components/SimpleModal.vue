<script setup lang="ts">
import ModalBox from '../../../src/ModalBox.vue'
import { onMounted, ref } from 'vue'

defineProps({
  msg: {
    type: String,
  },
})
type EmitName = 'confirm' | 'cancel'
type EmitsTypes = {
  (e: EmitName, value?: any): void
}

const emit = defineEmits<EmitsTypes>() // must emits

const show = ref(false)
const duration = ref(300)

onMounted(() => {
  show.value = true
})

const handleEmit = (emitAction: EmitName, val?: any) => {
  show.value = !show.value

  setTimeout(() => emit(emitAction, val), duration.value)
}
</script>

<template>
  <ModalBox
    overlay
    :transition="'scale'"
    :show="show"
    :duration="duration"
    focus-trap
    scrol-lock
    @click-outside="handleEmit('cancel')"
  >
  <div v-if="show" class="vcd-modal-box my-modal border border-gray-300">
    <p>{{ msg }}</p>
    <div class="modal-action">
      <button class="btn btn-primary" @click="handleEmit('confirm')">
        Confirm
      </button>
      <button class="btn" @click="handleEmit('cancel')">
        Cancel
      </button>
    </div>
    </div>
  </ModalBox>
</template>

<style>
.fix-transform {
  transform: translate(-50%, -50%) !important;
}
.my-modal {
    background-color: white;
    padding: 1.5rem;
    width: 100%;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    max-width: 32rem;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

</style>

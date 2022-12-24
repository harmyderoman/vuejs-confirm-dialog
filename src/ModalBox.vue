<template>
  <TransitionFade :duration="props.duration">
    <div v-if="props.overlay && props.show" class="vcd-modal-overlay"></div>
  </TransitionFade>
  <template v-if="props.focusTrap">
    <UseFocusTrap :options="focusOptions">
      <component ref="modal" :is="modalTransition" :duration="props.duration">
        <slot />
      </component>
    </UseFocusTrap>
  </template>
  <template v-else>
    <component ref="modal" :is="modalTransition" :duration="props.duration">
      <slot />
    </component>
  </template>
</template>

<script setup lang="ts">
/**
 * @name ModalBox - useful component for building modal dialogs
 * Features:
 * - Transitions
 * - Focus trap
 * - Scroll lock
 * - Overlay
 * @click-outside
 */
import {
  TransitionFade,
  TransitionSlide,
  TransitionScale,
  TransitionExpand,
} from '@morev/vue-transitions'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { onClickOutside, useScrollLock } from '@vueuse/core'
import { UseFocusTrap } from '@vueuse/integrations/useFocusTrap/component'

const props = defineProps({
  show: Boolean,
  overlay: Boolean,
  focusTrap: Boolean,
  scrolLock: Boolean,
  transition: String,
  class: String,
  duration: Number,
})

const emit = defineEmits(['click-outside'])

const modal = ref<HTMLElement | null>(null)
const focusOptions = computed(() => {
  return {
    immediate: props.focusTrap,
    allowOutsideClick: true,
  }
})
onClickOutside(modal, () => {
  emit('click-outside')
})

if(props.scrolLock) {
  const body = document.querySelector('body')
  const isLocked = useScrollLock(body)

  onMounted(() => {
    isLocked.value = true
  })

  onUnmounted(() => {
    isLocked.value = false
  })
}

const modalTransition = computed(() => {
  switch (props.transition) {
    case 'fade':
      return TransitionFade
    case 'scale':
      return TransitionScale
    case 'slide':
      return TransitionSlide
    case 'expand':
      return TransitionExpand

    default:
      return TransitionFade
  }
})
</script>

<style>
.vcd-modal-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #cececec1;
}
/* 
.vcd-modal-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
} */
</style>

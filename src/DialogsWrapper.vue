<template>
  <component
    v-for="(dialog, index) in DialogsStore"
    :is="dialog.dialog"
    :show="unrefValue(dialog.isRevealed)"
    v-bind="dialog.props"
    @confirm="dialog.confirm"
    @cancel="dialog.cancel"
    :key="index"
  ></component>
</template>

<script setup lang="ts">
import { unref, Ref, UnwrapRef } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'

function unrefValue<T>(val: Ref<T>): T {
  return unref(val)
}

const { DialogsStore } = useDialogWrapper()
</script>

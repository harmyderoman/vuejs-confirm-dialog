<template>
  <component
    v-for="dialogData in DialogsStore"
    :is="dialogData.dialog"
    v-bind="dialogData.props"
    @confirm="dialogData.confirm"
    @cancel="dialogData.cancel"
    :key="dialogData.id"
  ></component>
</template>

<script setup lang="ts">
/**
 * `DialogsWrapper` - the component that contains all
 * modal dialogs of the app
 */
import { useDialogWrapper } from './useDialogWrapper'

const { DialogsStore } = useDialogWrapper()
</script>

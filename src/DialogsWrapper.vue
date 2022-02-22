<template>
  <component
    v-for="(dialogData, index) in DialogsStore"
    :is="dialogData.dialog"
    v-bind="dialogData.props"
    @confirm="dialogData.confirm"
    @cancel="dialogData.cancel"
    :key="index"
  ></component>
</template>

<script setup lang="ts">
import { useDialogWrapper } from './useDialogWrapper'

const { DialogsStore } = useDialogWrapper()
</script>

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

<script lang="ts">
import { useDialogWrapper } from './useDialogWrapper'
import { defineComponent } from 'vue-demi'

/**
 * `DialogsWrapper` - the component that contains all
 * modal dialogs of the app
 */
export default defineComponent({
  name: 'DialogsWrapper',
  setup() {
    const { DialogsStore } = useDialogWrapper()

    return {
      DialogsStore
    }
  }
})
</script>

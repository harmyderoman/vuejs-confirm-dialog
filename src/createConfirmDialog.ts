import { ref, Prop, ComputedRef, Ref, Component, watch } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export type PropsData = {
  [key: string]: Prop<unknown, unknown>
}
export interface CreateConfirmDialogFnReturn {
  reveal: (
    data?: PropsData
  ) => Promise<UseConfirmDialogRevealResult<PropsData, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
}

export const createConfirmDialog = function (
  dialog: Component,
  props: PropsData = {}
): CreateConfirmDialogFnReturn {
  const propsRef: Ref<PropsData> = ref(props)

  const { addDialog, removeDialog, getLatestId} = useDialogWrapper()
  const { 
    reveal,
    isRevealed, 
    onConfirm, 
    onReveal, 
    onCancel, 
    confirm, 
    cancel 
  } = useConfirmDialog()

  const DIALOG_ID = getLatestId() + 1

  onReveal((data: PropsData) => {

    for (const prop in data) {
      propsRef.value[prop] = data[prop]
    }

    addDialog({
      id: DIALOG_ID,
      dialog,
      isRevealed,
      confirm,
      cancel,
      props: propsRef.value,
    })

  })

  watch( isRevealed,
    (value) => {
    if(!value) {
      removeDialog(DIALOG_ID)
    }
  })

  return {
    reveal,
    isRevealed,
    onConfirm,
    onCancel,
  }
}

import { ref, ComputedRef, Ref, Component, watch } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export type PropsData = {
  [key: string]: any
}
export type CreateConfirmDialogFnReturn = {
  reveal: (
    data?: PropsData
  ) => Promise<UseConfirmDialogRevealResult<PropsData, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
}

/**
 * Function that makes simple to create, reuse, 
 * promisify and build chains of modal dialogs. 
 * 
 * @param dialog - a component that used for modal dialog
 * @param props - new props data for dialog component, optional
 * @returns `{ reveal, isRevealed, onConfirm, onCancel }` -
 * `reveal` - shows the component
 * `isRevealed` - return computed mark if the component is shown
 * `onConfirm` - hook that gets a callback for user's confirmation
 * `onCancel` - hook that gets a callback for user's canceling
 */
export const createConfirmDialog = function (
  dialog: Component,
  props: PropsData = {}
): CreateConfirmDialogFnReturn {
  const propsRef: Ref<PropsData> = ref(props)

  const { addDialog, removeDialog, getLatestId } = useDialogWrapper()
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

  onReveal((data?: PropsData) => {

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

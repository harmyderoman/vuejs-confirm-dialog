import { ref, ComputedRef, Ref, Component, watch, computed } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export type PropsData = {
  [key: string]: any
}

/**
 * Function that makes simple to create, reuse, 
 * promisify and build chains of modal dialogs. 
 * 
 * @param dialog - a component that used for modal dialog
 * @param props - new props data for dialog component, optional
 * @returns `{ reveal, isRevealed, onConfirm, onCancel, close, closeAll }` -
 * `reveal` - shows the component
 * `isRevealed` - return computed mark if the component is shown
 * `onConfirm` - hook that gets a callback for user's confirmation
 * `onCancel` - hook that gets a callback for user's canceling
 * `close` - close the dialog without triggering any hook and don't change `isRevealed`
 * `closeAll` - close all open dialogs
 */
export const createConfirmDialog = function (
  dialog: Component,
  props: PropsData = {}
): {
  close: () => void

  closeAll: () => void

  reveal: (
    data?: PropsData
  ) => Promise<UseConfirmDialogRevealResult<PropsData, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
} {
  const propsRef: Ref<PropsData> = ref(props)
  const revealed = ref(false)

  const close = () => {
    revealed.value = false
    removeDialog(DIALOG_ID)
  }

  const { addDialog, removeDialog, removeAll, DialogsStore } = useDialogWrapper()
  const { 
    reveal,
    isRevealed, 
    onConfirm, 
    onReveal, 
    onCancel, 
    confirm, 
    cancel 
  } = useConfirmDialog()

  const DIALOG_ID = Math.floor(Math.random() * 1000000000)

  onReveal((data?: PropsData) => {

    revealed.value = true
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
      close,
      revealed
    })

  })

  watch( isRevealed,
    (value) => {
    if(!value) {
      removeDialog(DIALOG_ID)
    }
  })

  const closeAll = () =>{
    DialogsStore.forEach(dialog => {
      dialog.revealed.value = false
    })
    removeAll()
  }

  return {
    close,
    closeAll,
    reveal,
    isRevealed: computed(() => isRevealed.value && revealed.value),
    onConfirm,
    onCancel,
  }
}

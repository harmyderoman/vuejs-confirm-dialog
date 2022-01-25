import { Component, Ref, shallowRef } from 'vue-demi'
import { PropsData } from './index'

export interface UseDialogWrapperReturn {
  DialogsStore: Ref<DialogData[]>
  addDialog: (data: DialogData) => void
}

export interface DialogData {
  dialog: Component
  isRevealed: Ref<boolean>
  confirm: (data: PropsData) => void
  cancel: (data: PropsData) => void
  props: PropsData
}

const DialogsStore: Ref<DialogData[]> = shallowRef([])

export const useDialogWrapper = function (): UseDialogWrapperReturn {
  const addDialog = function (data: DialogData) {
    DialogsStore.value.push(data)
  }

  return {
    DialogsStore,
    addDialog,
  }
}

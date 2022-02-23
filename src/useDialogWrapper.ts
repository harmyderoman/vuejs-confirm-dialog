import { Component, markRaw, Ref, ref, shallowRef } from 'vue-demi'
import { PropsData } from './index'

export interface UseDialogWrapperReturn {
  DialogsStore: Ref<DialogData[]>
  addDialog: (data: DialogData) => void,
  removeDialog: () => void
}

export interface DialogData {
  dialog: Component
  isRevealed: Ref<boolean>
  confirm: (data: PropsData) => void
  cancel: (data: PropsData) => void
  props: PropsData
}

const DialogsStore: Ref<DialogData[]> = ref([])

export const useDialogWrapper = function (): UseDialogWrapperReturn {

  const dialogIndex: Ref<number> = ref(-1)

  const addDialog = function (data: DialogData) {
    dialogIndex.value = DialogsStore.value.length
    DialogsStore.value.push(markRaw(data))
  }

  const removeDialog = function (){
    if(dialogIndex.value > -1){
      DialogsStore.value.splice( dialogIndex.value, 1)
    }
  }

  return {
    DialogsStore,
    addDialog,
    removeDialog
  }
}

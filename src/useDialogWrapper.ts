import { Component, markRaw, Ref, reactive } from 'vue-demi'
import { PropsData } from './index'

export interface UseDialogWrapperReturn {
  DialogsStore: DialogData[]
  addDialog: (data: DialogData) => void,
  removeDialog: (id: number) => void
  getLatestId: () => number
}

export interface DialogData {
  id: number
  dialog: Component
  isRevealed: Ref<boolean>
  confirm: (data: PropsData) => void
  cancel: (data: PropsData) => void
  props: PropsData
}

const DialogsStore: DialogData[] = reactive([])

export const useDialogWrapper = function (): UseDialogWrapperReturn {

  const addDialog = function (data: DialogData) {
    DialogsStore.push(markRaw(data))
  }

  const removeDialog = function (id: number){
    const index = DialogsStore.findIndex(dialog => dialog.id == id)
      DialogsStore.splice( index, 1)
  }

  const getLatestId = () => {
    if(DialogsStore.length > 0) {
      const IDs = DialogsStore.map(dialog => dialog.id)
      
      return Math.max(...IDs)
    }
    return 0
  }

  return {
    DialogsStore,
    addDialog,
    removeDialog,
    getLatestId
  }
}

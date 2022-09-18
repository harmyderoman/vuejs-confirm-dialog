import { markRaw, Ref, reactive, DefineComponent } from 'vue-demi'
import { ComponentProps } from './index'

export type UseDialogWrapperReturn = {
  DialogsStore: DialogData<any>[]
  addDialog: (dialogData: DialogData<any>) => void,
  removeDialog: (id: number) => void,
  removeAll: () => void
}

export type DialogData<C extends DefineComponent<any,any,any,any,any,any>> = {
  id: number
  dialog: C
  isRevealed: Ref<boolean>
  confirm: (data?: ComponentProps<C>) => void
  cancel: (data?: ComponentProps<C>) => void
  props: ComponentProps<C>,
  close: () => void,
  revealed: Ref<boolean>
}

const DialogsStore: DialogData<any>[] = reactive([])

export const useDialogWrapper = function (): UseDialogWrapperReturn {

  const addDialog = function (dialogData: DialogData<any>) {
    DialogsStore.push(markRaw(dialogData))
  }

  const removeDialog = function (id: number){
    const index = DialogsStore.findIndex(dialog => dialog.id == id)
      DialogsStore.splice( index, 1)
  }

  const removeAll = function () {
    DialogsStore.splice(0)
  }

  return {
    DialogsStore,
    addDialog,
    removeDialog,
    removeAll
  }
}

import { markRaw, Ref, reactive, DefineComponent } from 'vue'
import { ComponentProps } from './index'

export type DialogTarget = string | HTMLElement

export type UseDialogWrapperReturn = {
  DialogsStore: DialogData<any>[]
  addDialog: (dialogData: DialogData<any>) => void
  removeDialog: (id: number) => void
  removeAll: () => void
}

export type DialogData<
  C extends DefineComponent<any, any, any, any, any, any>,
> = {
  id: number
  dialog: C
  isRevealed: Ref<boolean>
  confirm: (data?: any) => void
  cancel: (data?: any) => void
  props: ComponentProps<C>
  close: () => void
  revealed: Ref<boolean>
  target?: DialogTarget
}

const DialogsStore: DialogData<any>[] = reactive([])

export const useDialogWrapper = function (): UseDialogWrapperReturn {
  const addDialog = function (dialogData: DialogData<any>) {
    DialogsStore.push(markRaw(dialogData))
  }

  const removeDialog = function (id: number) {
    const index = DialogsStore.findIndex((dialog) => dialog.id === id)
    // splice(-1, 1) would remove the last, unrelated dialog
    if (index !== -1) DialogsStore.splice(index, 1)
  }

  const removeAll = function () {
    DialogsStore.splice(0)
  }

  return {
    DialogsStore,
    addDialog,
    removeDialog,
    removeAll,
  }
}

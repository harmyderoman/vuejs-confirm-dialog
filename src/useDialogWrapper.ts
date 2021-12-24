import { Component, Ref, shallowRef } from 'vue-demi'

export interface useDialogWrapperReturn {
  DialogsStore: Ref<Component[]>
  addComponent: (component: Component) => void
}

const DialogsStore: Ref<Component[]> = shallowRef([])

export const useDialogWrapper = function (): useDialogWrapperReturn {
  const addComponent = function (component: Component) {
    DialogsStore.value.push(component)
  }

  return {
    DialogsStore,
    addComponent,
  }
}

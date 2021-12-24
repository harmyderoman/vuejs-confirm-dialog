import { Component, Ref, shallowRef } from 'vue-demi'

const DialogsStore: Ref<Component[]> = shallowRef([])

export const useDialogWrapper = function () {
  const addComponent = function (comp: any) {
    DialogsStore.value.push(comp)
  }

  return {
    DialogsStore,
    addComponent,
  }
}

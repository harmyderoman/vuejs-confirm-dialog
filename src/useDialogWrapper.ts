import { Component, DefineComponent, h, reactive, Ref, ref, shallowRef, unref } from 'vue-demi';

const DialogsStore: Ref<Component[]> = shallowRef([])

export const useDialogWrapper = function () {

  const addComponent = function (comp: any) {
    DialogsStore.value.push(comp)
  }

  const createRenderFunction = function (comp: DefineComponent, show: Ref, confirm: any, cancel: any) {

    return function () {
      return h(
        comp,
        {
          show: unref(show),
          onConfirm: confirm,
          onCancel: cancel
        },
      )
    }
  }

  return {
    DialogsStore,
    addComponent,
    createRenderFunction
  }
}  
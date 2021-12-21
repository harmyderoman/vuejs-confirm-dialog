import { DefineComponent, ref } from "vue-demi"
import { useDialogWrapper } from "./useDialogWrapper"
import { useConfirmDialog } from "@vueuse/core"

export const create = function (
  component: DefineComponent,
  props = {} as any
) {

  const propsRef = ref(props)

  const { addComponent, createRenderFunction } = useDialogWrapper()
  const {
    reveal,
    isRevealed,
    onConfirm,
    onReveal,
    onCancel,
    confirm,
    cancel } = useConfirmDialog()

  onReveal((data) => {
    console.log('on reveal:')
    console.log(data)
    for (const prop in data) {
      propsRef.value[prop] = data[prop]
    }
  })

  addComponent({ component, isRevealed, confirm, cancel, props: propsRef.value })

  return {
    reveal,
    isRevealed,
    onConfirm,
    onCancel
  }
}
import { DefineComponent, ref, Prop, ComputedRef } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export interface PropsData {
  [key: string]: Prop<unknown, unknown>
}
export interface CreateFnReturn {
  reveal: (
    data: PropsData
  ) => Promise<UseConfirmDialogRevealResult<PropsData, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
}

export const create = function (
  component: DefineComponent,
  props: PropsData = {}
): CreateFnReturn {
  const propsRef = ref(props)

  const { addComponent } = useDialogWrapper()
  const { reveal, isRevealed, onConfirm, onReveal, onCancel, confirm, cancel } =
    useConfirmDialog()

  onReveal((data) => {
    for (const prop in data) {
      propsRef.value[prop] = data[prop]
    }
  })

  addComponent({
    component,
    isRevealed,
    confirm,
    cancel,
    props: propsRef.value,
  })

  return {
    reveal,
    isRevealed,
    onConfirm,
    onCancel,
  }
}

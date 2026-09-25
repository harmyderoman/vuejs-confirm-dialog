import {
  ref,
  watch,
  computed,
  Component,
  VNodeProps,
  AllowedComponentProps,
} from 'vue-demi'
import type { ComputedRef, UnwrapRef } from 'vue-demi'
import { useDialogWrapper } from './useDialogWrapper'
import {
  EventHookOn,
  useConfirmDialog,
  UseConfirmDialogRevealResult,
} from '@vueuse/core'

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

type PropsBehaviorOptions = {
  chore: boolean
  keepInitial: boolean
  closeDelay?: number
}

let lastDialogId = 0

function getDialogId() {
  return ++lastDialogId
}

/**
 * Function that makes simple to create, reuse,
 * promisify and build chains of modal dialogs.
 *
 * @param dialog - a component that used for modal dialog
 * @param initialAttrs - new props data for dialog component, optional
 * @param options - props behavior settings, optional
 * @returns `{ reveal, isRevealed, onConfirm, onCancel, close, closeAll }` -
 * `reveal` - shows the component
 * `isRevealed` - return computed mark if the component is shown
 * `onConfirm` - hook that gets a callback for user's confirmation
 * `onCancel` - hook that gets a callback for user's canceling
 * `close` - close the dialog without triggering any hook and don't change `isRevealed`
 * `closeAll` - close all open dialogs
 *
 * `options.closeDelay` - milliseconds to wait before unmounting the dialog
 * component after it's closed (confirm/cancel/close), so exit transitions
 * inside the dialog component have time to finish. Defaults to `0` (unmount
 * immediately, previous behavior).
 */
export function createConfirmDialog<C extends Component>(
  dialog: C,
  initialAttrs: ComponentProps<C> = {} as ComponentProps<C>,
  options: PropsBehaviorOptions = { chore: false, keepInitial: false }
): {
  close: () => void

  closeAll: () => void

  reveal: (
    props?: ComponentProps<C>
  ) => Promise<UseConfirmDialogRevealResult<any, boolean>>

  isRevealed: ComputedRef<boolean>

  onConfirm: EventHookOn

  onCancel: EventHookOn
} {
  const setAttrs = (attrs: ComponentProps<C> | null) => {
    if (!attrs) {
      propsRef.value = {} as UnwrapRef<ComponentProps<C>>
      return
    }
    for (const prop in attrs) {
      propsRef.value[prop] = attrs[prop]
    }
  }

  const propsRef = ref({} as ComponentProps<C>)
  setAttrs(initialAttrs)
  const revealed = ref(false)

  const { addDialog, removeDialog, removeAll, DialogsStore } =
    useDialogWrapper()

  const scheduleRemoveDialog = () => {
    if (options.closeDelay) {
      setTimeout(() => removeDialog(DIALOG_ID), options.closeDelay)
    } else {
      removeDialog(DIALOG_ID)
    }
  }

  const close = () => {
    revealed.value = false
    scheduleRemoveDialog()
  }

  const { reveal, isRevealed, onConfirm, onReveal, onCancel, confirm, cancel } =
    useConfirmDialog()

  const DIALOG_ID = getDialogId()

  onReveal((props?: ComponentProps<C>) => {
    revealed.value = true
    if (props) setAttrs(props as ComponentProps<C>)

    addDialog({
      id: DIALOG_ID,
      dialog,
      isRevealed,
      confirm,
      cancel,
      props: propsRef.value,
      close,
      revealed,
    })
  })

  // flush: 'sync' avoids Vue's default batching, which would otherwise
  // coalesce a reveal() immediately followed by confirm()/cancel() (no tick
  // in between) into a net-unchanged value and silently skip this callback
  watch(
    isRevealed,
    (value) => {
      if (!value) {
        if (options.chore) {
          setAttrs(options.keepInitial ? initialAttrs : null)
        }

        scheduleRemoveDialog()
      }
    },
    { flush: 'sync' }
  )

  const closeAll = () => {
    DialogsStore.forEach((dialog) => {
      dialog.revealed.value = false
    })
    removeAll()
  }

  return {
    close,
    closeAll,
    reveal,
    isRevealed: computed(() => isRevealed.value && revealed.value),
    onConfirm,
    onCancel,
  }
}

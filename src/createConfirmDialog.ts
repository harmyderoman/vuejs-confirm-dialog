import {
  ref,
  reactive,
  markRaw,
  computed,
  Component,
  VNodeProps,
  AllowedComponentProps,
} from 'vue'
import type { ComputedRef } from 'vue'
import { createEventHook } from '@vueuse/core'
import type { EventHookOn } from '@vueuse/core'
import { useDialogWrapper } from './useDialogWrapper'
import type { DialogData, DialogTarget } from './useDialogWrapper'
import { ensureMounted } from './mountDialogsRoot'

export type ComponentProps<C extends Component> = C extends new (
  ...args: any
) => any
  ? Omit<
      InstanceType<C>['$props'],
      keyof VNodeProps | keyof AllowedComponentProps
    >
  : never

type EmitHandler<C, E extends string> = C extends new (...args: any) => {
  $props: infer P
}
  ? `on${Capitalize<E>}` extends keyof P
    ? NonNullable<P[`on${Capitalize<E>}`]>
    : never
  : never

type FirstArg<A extends any[]> = number extends A['length']
  ? any
  : A extends []
    ? undefined
    : A[0]

/**
 * Payload type of the component's `confirm`/`cancel` emit, taken from its
 * `defineEmits` declaration. Falls back to `any` when the emit is untyped
 * (e.g. `defineEmits(['confirm', 'cancel'])`).
 */
export type EmitPayload<C, E extends string> = [EmitHandler<C, E>] extends [
  never,
]
  ? any
  : EmitHandler<C, E> extends (...args: infer A) => any
    ? FirstArg<A>
    : any

export type RevealResult<C = any> =
  | { data?: EmitPayload<C, 'confirm'>; isCanceled: false; closed?: false }
  | { data?: EmitPayload<C, 'cancel'>; isCanceled: true; closed?: boolean }

export type ResetPropsMode = 'none' | 'initial' | 'defaults'

export type ConfirmDialogOptions = {
  /**
   * What to do with props after the dialog closes:
   * - `'none'` (default) - keep the last passed values
   * - `'initial'` - go back to the values passed to `createConfirmDialog`
   * - `'defaults'` - drop everything, so the component's own defaults apply
   */
  resetProps?: ResetPropsMode
  /** Milliseconds to keep the component mounted after closing, for exit animations. */
  closeDelay?: number
  /**
   * Where to render the dialog: a CSS selector or an element. Defaults to the
   * shared root in `document.body`. Falls back to it (with a warning) when the
   * target isn't in the DOM at reveal time.
   */
  target?: DialogTarget
  /**
   * @deprecated Will be removed in 2.0 - use `resetProps`.
   * `{ chore: true }` = `resetProps: 'defaults'`
   */
  chore?: boolean
  /**
   * @deprecated Will be removed in 2.0 - use `resetProps`.
   * `{ chore: true, keepInitial: true }` = `resetProps: 'initial'`
   */
  keepInitial?: boolean
}

export type ConfirmDialog<C extends Component> = {
  /**
   * Shows the dialog. Resolves once it's confirmed, canceled or closed.
   * Revealing an already open dialog only updates its props and returns the
   * same pending promise - use a separate instance per dialog that should be
   * open at the same time (e.g. one per toast).
   */
  reveal: (props?: ComponentProps<C>) => Promise<RevealResult<C>>
  /** Updates props of the dialog, including while it's open. */
  update: (props: Partial<ComponentProps<C>>) => void
  /**
   * Closes the dialog without calling `onConfirm`/`onCancel`. The pending
   * `reveal()` promise resolves with `{ isCanceled: true, closed: true }`.
   */
  close: () => void
  /** Closes every open dialog, the same way `close()` does. */
  closeAll: () => void
  isRevealed: ComputedRef<boolean>
  onConfirm: EventHookOn<EmitPayload<C, 'confirm'>>
  onCancel: EventHookOn<EmitPayload<C, 'cancel'>>
}

let lastDialogId = 0

let warnedLegacyResetOptions = false

function resolveResetMode(options: ConfirmDialogOptions): ResetPropsMode {
  if (
    !warnedLegacyResetOptions &&
    ('chore' in options || 'keepInitial' in options)
  ) {
    warnedLegacyResetOptions = true
    console.warn(
      "[vuejs-confirm-dialog] `chore`/`keepInitial` are deprecated and will be removed in 2.0. Use `resetProps: 'none' | 'initial' | 'defaults'` instead."
    )
  }
  if (options.resetProps) return options.resetProps
  if (!options.chore) return 'none'
  return options.keepInitial ? 'initial' : 'defaults'
}

/**
 * Turns a modal component into an async function: `await dialog.reveal()`
 * resolves with the user's decision.
 *
 * @param dialog - component used as the dialog; must emit `confirm`/`cancel`
 * @param initialAttrs - initial props for the component
 * @param options - see {@link ConfirmDialogOptions}
 */
export function createConfirmDialog<C extends Component>(
  dialog: C,
  initialAttrs: ComponentProps<C> = {} as ComponentProps<C>,
  options: ConfirmDialogOptions = {}
): ConfirmDialog<C> {
  type ConfirmData = EmitPayload<C, 'confirm'>
  type CancelData = EmitPayload<C, 'cancel'>

  const { addDialog, removeDialog, DialogsStore } = useDialogWrapper()
  const resetMode = resolveResetMode(options)

  // one reactive object for the whole lifetime of the instance, so the store
  // entry and the rendered component never hold a stale props reference
  const props: Record<string, unknown> = reactive({})
  const setAttrs = (attrs?: object | null) => {
    if (!attrs) return
    Object.assign(props, attrs)
  }
  const clearAttrs = () => {
    for (const key of Object.keys(props)) delete props[key]
  }
  setAttrs(initialAttrs)

  const revealed = ref(false)
  // typed as `any` internally - the vueuse Callback<T> conditional type can't
  // be resolved for a still-generic C; the public `on` is re-typed on return
  const confirmHook = createEventHook<any>()
  const cancelHook = createEventHook<any>()

  let pending: Promise<RevealResult<C>> | null = null
  let resolvePending: ((result: RevealResult<C>) => void) | null = null
  let removeTimer: ReturnType<typeof setTimeout> | undefined

  const id = ++lastDialogId

  const finish = (result: RevealResult<C>, trigger?: () => void) => {
    // ignores a second confirm/cancel, e.g. a double click while the dialog
    // is still on screen during its closeDelay exit animation
    if (!revealed.value) return
    revealed.value = false

    if (resetMode === 'defaults') clearAttrs()
    if (resetMode === 'initial') {
      clearAttrs()
      setAttrs(initialAttrs)
    }

    if (options.closeDelay) {
      removeTimer = setTimeout(() => removeDialog(id), options.closeDelay)
    } else {
      removeDialog(id)
    }

    const resolve = resolvePending
    pending = resolvePending = null
    trigger?.()
    resolve?.(result)
  }

  const confirm = (data?: ConfirmData) =>
    finish({ data, isCanceled: false }, () => confirmHook.trigger(data))
  const cancel = (data?: CancelData) =>
    finish({ data, isCanceled: true }, () => cancelHook.trigger(data))
  const close = () =>
    finish({ data: undefined, isCanceled: true, closed: true })

  const entry: DialogData<any> = markRaw({
    id,
    dialog,
    isRevealed: revealed,
    revealed,
    confirm,
    cancel,
    close,
    props,
    target: options.target,
  })

  const reveal = (attrs?: ComponentProps<C>): Promise<RevealResult<C>> => {
    // SSR: dialogs are client-only. Leave props and the shared store alone -
    // `setup()` re-runs during hydration, where `reveal()` fires for real.
    if (typeof document === 'undefined') return new Promise(() => {})

    setAttrs(attrs)
    if (revealed.value && pending) return pending

    clearTimeout(removeTimer)
    revealed.value = true
    pending = new Promise((resolve) => (resolvePending = resolve))

    ensureMounted()
    // may still be in the store while its closeDelay timer was pending
    if (!DialogsStore.some((d) => d.id === id)) addDialog(entry)

    return pending
  }

  const closeAll = () => {
    for (const d of [...DialogsStore]) d.close()
  }

  return {
    reveal,
    update: setAttrs,
    close,
    closeAll,
    isRevealed: computed(() => revealed.value),
    onConfirm: confirmHook.on as EventHookOn<ConfirmData>,
    onCancel: cancelHook.on as EventHookOn<CancelData>,
  }
}

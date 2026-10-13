import {
  App,
  Teleport,
  TransitionGroup,
  createVNode,
  defineComponent,
  h,
  render,
} from 'vue'
import { useDialogWrapper } from './useDialogWrapper'
import type { DialogData, DialogTarget } from './useDialogWrapper'

let hostApp: App | null = null
let container: HTMLElement | null = null

/**
 * Called from `install()` so the auto-mounted root can inherit the host
 * app's plugins/provides/global components.
 */
export function setHostApp(app: App) {
  hostApp = app
}

const warnedTargets = new Set<DialogTarget>()

function resolveTarget(target?: DialogTarget): Element | null {
  if (!target) return null
  const el =
    typeof target === 'string' ? document.querySelector(target) : target
  if (el && el.isConnected) return el
  if (!warnedTargets.has(target)) {
    warnedTargets.add(target)
    console.warn(
      `[vuejs-confirm-dialog] target ${String(target)} is not in the DOM, rendering into the default root instead`
    )
  }
  return null
}

const renderDialog = (dialogData: DialogData<any>) =>
  h(dialogData.dialog, {
    onConfirm: dialogData.confirm,
    onCancel: dialogData.cancel,
    key: dialogData.id,
    ...dialogData.props,
  })

const renderList = (dialogs: DialogData<any>[]) =>
  h(
    TransitionGroup,
    { tag: 'div' },
    { default: () => dialogs.map(renderDialog) }
  )

const DialogsRoot = defineComponent({
  name: 'DialogsRoot',
  setup() {
    const { DialogsStore } = useDialogWrapper()
    // targets stay rendered once used, so the last dialog in a target can
    // still play its leave transition instead of the whole Teleport vanishing
    const targets = new Set<Element>()
    const keys = new WeakMap<Element, number>()
    let lastKey = 0
    const keyOf = (el: Element) => {
      if (!keys.has(el)) keys.set(el, ++lastKey)
      return keys.get(el)!
    }

    return () => {
      const local: DialogData<any>[] = []
      const byTarget = new Map<Element, DialogData<any>[]>()

      for (const dialogData of DialogsStore) {
        const el = resolveTarget(dialogData.target)
        if (!el) {
          local.push(dialogData)
          continue
        }
        targets.add(el)
        if (!byTarget.has(el)) byTarget.set(el, [])
        byTarget.get(el)!.push(dialogData)
      }

      for (const el of targets) if (!el.isConnected) targets.delete(el)

      return [
        renderList(local),
        ...[...targets].map((el) =>
          h(Teleport, { to: el, key: keyOf(el) }, [
            renderList(byTarget.get(el) ?? []),
          ])
        ),
      ]
    }
  },
})

/**
 * Lazily mounts the dialogs root into `document.body` on first use. Safe to
 * call repeatedly - only mounts once. `vnode.appContext` is set to the host
 * app's context (captured via `setHostApp`) so dialog components can
 * `inject()` values provided by the consumer's app; without `install()`
 * called first, dialogs still render, just without that inherited context.
 *
 * SSR-safe: with no `document` there's nothing to mount into yet - the real
 * mount happens on the next `reveal()` once the app has hydrated.
 */
export function ensureMounted() {
  if (container || typeof document === 'undefined') return

  container = document.createElement('div')
  container.setAttribute('id', 'vuejs-confirm-dialog-root')
  document.body.appendChild(container)

  const vnode = createVNode(DialogsRoot)
  if (hostApp) {
    vnode.appContext = hostApp._context
  }

  render(vnode, container)
}

/** Test-only: unmounts the root and resets module-level state between test cases. */
export function __resetForTests() {
  if (container) {
    render(null, container)
    container.remove()
  }
  container = null
  hostApp = null
  warnedTargets.clear()
}

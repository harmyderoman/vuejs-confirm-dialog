import {
  App,
  TransitionGroup,
  createVNode,
  defineComponent,
  h,
  render,
} from 'vue'
import { useDialogWrapper } from './useDialogWrapper'

let hostApp: App | null = null
let mounted = false

/**
 * Called from `install()` so the auto-mounted root can inherit the host
 * app's plugins/provides/global components.
 */
export function setHostApp(app: App) {
  hostApp = app
}

const DialogsRoot = defineComponent({
  name: 'DialogsRoot',
  setup() {
    const { DialogsStore } = useDialogWrapper()

    return () =>
      h(
        TransitionGroup,
        { tag: 'div' },
        {
          default: () =>
            DialogsStore.map((dialogData) =>
              h(dialogData.dialog, {
                is: dialogData.dialog,
                onConfirm: dialogData.confirm,
                onCancel: dialogData.cancel,
                key: dialogData.id,
                ...dialogData.props,
              })
            ),
        }
      )
  },
})

/**
 * Lazily mounts the dialogs root into `document.body` on first use. Safe to
 * call repeatedly - only mounts once. `vnode.appContext` is set to the host
 * app's context (captured via `setHostApp`) so dialog components can
 * `inject()` values provided by the consumer's app; without `install()`
 * called first, dialogs still render, just without that inherited context.
 *
 * SSR-safe: `reveal()` (which triggers this) is only ever meant to run in
 * response to user interaction, so it should never fire during a server
 * render - but if it does (e.g. a misuse that reveals eagerly in `setup()`),
 * there's no `document` to mount into yet. Skip without flipping `mounted`,
 * so the real mount still happens on the next `reveal()` once hydrated.
 */
export function ensureMounted() {
  if (mounted) return
  if (typeof document === 'undefined') return
  mounted = true

  const container = document.createElement('div')
  container.setAttribute('id', 'vuejs-confirm-dialog-root')
  document.body.appendChild(container)

  const vnode = createVNode(DialogsRoot)
  if (hostApp) {
    vnode.appContext = hostApp._context
  }

  render(vnode, container)
}

/** Test-only: resets the module-level mount state between test cases. */
export function __resetForTests() {
  hostApp = null
  mounted = false
  document.getElementById('vuejs-confirm-dialog-root')?.remove()
}

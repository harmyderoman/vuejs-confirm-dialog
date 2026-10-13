import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, onMounted } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createConfirmDialog, install } from './../../src/index'
import { useDialogWrapper } from './../../src/useDialogWrapper'
import { __resetForTests } from './../../src/mountDialogsRoot'

const Dialog = defineComponent({
  props: { text: String },
  emits: ['confirm', 'cancel'],
  render() {
    return h('div', { class: 'dlg' }, this.text)
  },
})

const makeApp = (when: 'setup' | 'mounted', target?: string) =>
  defineComponent({
    setup() {
      const d = createConfirmDialog(Dialog, { text: 'hello' }, { target })
      if (when === 'setup') d.reveal()
      else onMounted(() => d.reveal())
      return () => h('main', [h('p', 'page'), h('div', { id: 'toast-stack' })])
    },
  })

afterEach(() => {
  useDialogWrapper().removeAll()
  __resetForTests()
  document.body.innerHTML = ''
})

describe.each([
  ['setup', undefined],
  ['setup', '#toast-stack'],
  ['mounted', undefined],
  ['mounted', '#toast-stack'],
] as const)('hydration: reveal in %s, target %s', (when, target) => {
  it('hydrates without warnings and shows the dialog once', async () => {
    // a real server has no DOM at all - reveal() must be a no-op there
    vi.stubGlobal('document', undefined)
    const html = await renderToString(createSSRApp(makeApp(when, target)))
    vi.unstubAllGlobals()
    document.body.innerHTML = `<div id="app">${html}</div>`

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const app = createSSRApp(makeApp(when, target))
    install(app)
    app.mount('#app')
    await nextTick()
    await nextTick()

    const logs = [...warn.mock.calls, ...error.mock.calls].map((c) => String(c[0]))
    warn.mockRestore()
    error.mockRestore()

    expect(logs).toEqual([])
    expect(document.querySelectorAll('.dlg')).toHaveLength(1)
    if (target) expect(document.querySelector('#toast-stack .dlg')).not.toBeNull()
  })
})

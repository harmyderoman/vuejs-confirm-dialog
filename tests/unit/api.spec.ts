import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { createConfirmDialog } from './../../src/index'
import type { ConfirmDialog, RevealResult } from './../../src/index'
import { useDialogWrapper } from './../../src/useDialogWrapper'
import { __resetForTests } from './../../src/mountDialogsRoot'
import DialogComp from './../components/DialogComp'
import TypedDialog from './../components/TypedDialog.vue'

const TextDialog = defineComponent({
  name: 'TextDialog',
  props: {
    text: { type: String, default: 'default text' },
    extra: { type: String, default: '' },
  },
  emits: {
    confirm: (_value: number) => true,
    cancel: (_reason: string) => true,
  },
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'text-dialog' }, [
        h('span', { class: 'text' }, `${props.text}${props.extra}`),
        h('button', { class: 'ok', onClick: () => emit('confirm', 42) }),
        h('button', { class: 'no', onClick: () => emit('cancel', 'nope') }),
      ])
  },
})

const { DialogsStore, removeAll } = useDialogWrapper()

const store = () => DialogsStore
const findEntry = () => DialogsStore[0]
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// <TransitionGroup> removes leaving nodes after its leave lifecycle, even
// without CSS transitions - give it a moment before asserting on the DOM
const settleDom = async () => {
  await nextTick()
  await wait(20)
}

afterEach(() => {
  removeAll()
  __resetForTests()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('reveal()', () => {
  it('adds the dialog to the store and renders it', async () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'hello' })
    dialog.reveal()
    await nextTick()

    expect(store()).toHaveLength(1)
    expect(document.body.textContent).toContain('hello')
  })

  it('resolves with isCanceled: false and the payload on confirm', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const result = dialog.reveal()
    findEntry().confirm(42)

    await expect(result).resolves.toEqual({ data: 42, isCanceled: false })
  })

  it('resolves with isCanceled: true and the payload on cancel', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const result = dialog.reveal()
    findEntry().cancel('nope')

    await expect(result).resolves.toEqual({ data: 'nope', isCanceled: true })
  })

  it('resolves from the real component emits (DOM click)', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const result = dialog.reveal()
    await nextTick()

    document.querySelector<HTMLButtonElement>('.ok')!.click()

    await expect(result).resolves.toEqual({ data: 42, isCanceled: false })
  })

  it('merges reveal props over the initial props', async () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial', extra: '!' })
    dialog.reveal({ text: 'revealed' })
    await nextTick()

    expect(findEntry().props).toMatchObject({ text: 'revealed', extra: '!' })
    expect(document.body.textContent).toContain('revealed!')
  })

  it('does not duplicate an already open dialog and returns the same promise', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const first = dialog.reveal({ text: 'one' })
    const second = dialog.reveal({ text: 'two' })

    expect(second).toBe(first)
    expect(store()).toHaveLength(1)
    expect(findEntry().props.text).toBe('two')
  })

  it('re-revealing during closeDelay keeps the dialog instead of removing it', async () => {
    const dialog = createConfirmDialog(TextDialog, {}, { closeDelay: 30 })
    dialog.reveal()
    findEntry().confirm(1)
    dialog.reveal()

    await wait(50)

    expect(store()).toHaveLength(1)
    expect(dialog.isRevealed.value).toBe(true)
  })

  it('is a no-op during SSR (no document): store untouched, promise stays pending', async () => {
    vi.stubGlobal('document', undefined)
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' })
    let settled = false
    dialog.reveal({ text: 'ssr' }).then(() => (settled = true))
    vi.unstubAllGlobals()

    await wait(10)
    expect(settled).toBe(false)
    expect(store()).toHaveLength(0)
    expect(dialog.isRevealed.value).toBe(false)
  })
})

describe('update()', () => {
  it('updates props of an open dialog and re-renders it', async () => {
    const dialog = createConfirmDialog(TextDialog, { text: '14 / 40' })
    dialog.reveal()
    await nextTick()

    dialog.update({ text: '15 / 40' })
    await nextTick()

    expect(findEntry().props.text).toBe('15 / 40')
    expect(document.body.textContent).toContain('15 / 40')
  })

  it('applies to the next reveal when called while closed', async () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' })
    dialog.update({ text: 'updated' })
    dialog.reveal()
    await nextTick()

    expect(document.body.textContent).toContain('updated')
  })

  it('keeps the promise pending', async () => {
    const dialog = createConfirmDialog(TextDialog)
    let settled = false
    dialog.reveal().then(() => (settled = true))
    dialog.update({ text: 'x' })

    await wait(10)
    expect(settled).toBe(false)
  })
})

describe('close()', () => {
  it('resolves the pending promise with isCanceled: true, closed: true', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const result = dialog.reveal()
    dialog.close()

    await expect(result).resolves.toEqual({
      data: undefined,
      isCanceled: true,
      closed: true,
    })
  })

  it('does not call onConfirm or onCancel', async () => {
    const dialog = createConfirmDialog(TextDialog)
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    dialog.onConfirm(onConfirm)
    dialog.onCancel(onCancel)

    dialog.reveal()
    dialog.close()
    await nextTick()

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('removes the dialog from the store and the DOM', async () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'closing' })
    dialog.reveal()
    await nextTick()

    dialog.close()
    await settleDom()

    expect(store()).toHaveLength(0)
    expect(document.body.textContent).not.toContain('closing')
  })

  it('is a no-op when the dialog is not open', () => {
    const dialog = createConfirmDialog(TextDialog)
    expect(() => dialog.close()).not.toThrow()
    expect(store()).toHaveLength(0)
  })

  it('respects closeDelay', async () => {
    const dialog = createConfirmDialog(TextDialog, {}, { closeDelay: 30 })
    dialog.reveal()
    dialog.close()

    expect(store()).toHaveLength(1)
    await wait(50)
    expect(store()).toHaveLength(0)
  })
})

describe('closeAll()', () => {
  it('closes every open dialog and resolves each promise as closed', async () => {
    const first = createConfirmDialog(TextDialog)
    const second = createConfirmDialog(DialogComp)
    const firstResult = first.reveal()
    const secondResult = second.reveal()
    const onCancel = vi.fn()
    first.onCancel(onCancel)

    first.closeAll()

    await expect(firstResult).resolves.toMatchObject({ isCanceled: true, closed: true })
    await expect(secondResult).resolves.toMatchObject({ isCanceled: true, closed: true })
    expect(onCancel).not.toHaveBeenCalled()
    expect(store()).toHaveLength(0)
    expect(first.isRevealed.value).toBe(false)
    expect(second.isRevealed.value).toBe(false)
  })
})

describe('isRevealed', () => {
  it('tracks reveal/confirm/cancel/close', () => {
    const dialog = createConfirmDialog(TextDialog)
    expect(dialog.isRevealed.value).toBe(false)

    dialog.reveal()
    expect(dialog.isRevealed.value).toBe(true)
    findEntry().confirm(1)
    expect(dialog.isRevealed.value).toBe(false)

    dialog.reveal()
    findEntry().cancel('x')
    expect(dialog.isRevealed.value).toBe(false)

    dialog.reveal()
    dialog.close()
    expect(dialog.isRevealed.value).toBe(false)
  })
})

describe('onConfirm() / onCancel()', () => {
  it('are called with the emitted payload', () => {
    const dialog = createConfirmDialog(TextDialog)
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    dialog.onConfirm(onConfirm)
    dialog.onCancel(onCancel)

    dialog.reveal()
    findEntry().confirm(42)
    dialog.reveal()
    findEntry().cancel('nope')

    expect(onConfirm).toHaveBeenCalledExactlyOnceWith(42)
    expect(onCancel).toHaveBeenCalledExactlyOnceWith('nope')
  })

  it('fire only once when the dialog emits twice (e.g. double click during closeDelay)', () => {
    const dialog = createConfirmDialog(TextDialog, {}, { closeDelay: 30 })
    const onConfirm = vi.fn()
    dialog.onConfirm(onConfirm)

    dialog.reveal()
    findEntry().confirm(1)
    findEntry().confirm(2)

    expect(onConfirm).toHaveBeenCalledExactlyOnceWith(1)
  })

  it('stop firing after off()', () => {
    const dialog = createConfirmDialog(TextDialog)
    const onConfirm = vi.fn()
    const { off } = dialog.onConfirm(onConfirm)
    off()

    dialog.reveal()
    findEntry().confirm(1)

    expect(onConfirm).not.toHaveBeenCalled()
  })
})

describe('options.resetProps', () => {
  const revealAndConfirm = (dialog: ConfirmDialog<typeof TextDialog>) => {
    dialog.reveal({ text: 'revealed', extra: '?' })
    findEntry().confirm(1)
    dialog.reveal()
    return findEntry().props
  }

  it("'none' (default) keeps the last passed props", () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' })
    expect(revealAndConfirm(dialog)).toMatchObject({ text: 'revealed', extra: '?' })
  })

  it("'initial' goes back to the initial props, dropping reveal-only ones", () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' }, { resetProps: 'initial' })
    const props = revealAndConfirm(dialog)
    expect(props.text).toBe('initial')
    expect(props.extra).toBeUndefined()
  })

  it("'defaults' drops every prop so the component defaults apply", async () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' }, { resetProps: 'defaults' })
    const props = revealAndConfirm(dialog)
    await nextTick()

    expect(props).toEqual({})
    expect(document.body.textContent).toContain('default text')
  })

  it('resets after close() too', () => {
    const dialog = createConfirmDialog(TextDialog, { text: 'initial' }, { resetProps: 'initial' })
    dialog.reveal({ text: 'revealed' })
    dialog.close()
    expect(findEntry()).toBeUndefined()
    dialog.reveal()
    expect(findEntry().props.text).toBe('initial')
  })

  it('maps the deprecated chore/keepInitial options', () => {
    const legacyInitial = createConfirmDialog(TextDialog, { text: 'initial' }, { chore: true, keepInitial: true })
    expect(revealAndConfirm(legacyInitial).text).toBe('initial')
    removeAll()

    const legacyDefaults = createConfirmDialog(TextDialog, { text: 'initial' }, { chore: true, keepInitial: false })
    expect(revealAndConfirm(legacyDefaults)).toEqual({})
  })

  it('warns once about the deprecated options, and not for resetProps', async () => {
    vi.resetModules()
    const { createConfirmDialog: fresh } = await import('./../../src/createConfirmDialog')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    fresh(TextDialog, {}, { resetProps: 'initial' })
    expect(warn).not.toHaveBeenCalled()

    fresh(TextDialog, {}, { chore: true })
    fresh(TextDialog, {}, { chore: true, keepInitial: true })
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toContain('deprecated')
  })

  it('prefers resetProps over the deprecated options', () => {
    const dialog = createConfirmDialog(
      TextDialog,
      { text: 'initial' },
      { resetProps: 'none', chore: true, keepInitial: true }
    )
    expect(revealAndConfirm(dialog).text).toBe('revealed')
  })
})

describe('options.target', () => {
  const makeTarget = (id: string) => {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
    return el
  }

  it('renders into an element matched by a selector', async () => {
    const stack = makeTarget('toast-stack')
    createConfirmDialog(TextDialog, { text: 'toast' }, { target: '#toast-stack' }).reveal()
    await nextTick()

    expect(stack.textContent).toContain('toast')
    expect(document.getElementById('vuejs-confirm-dialog-root')!.textContent).not.toContain('toast')
  })

  it('renders into an element passed directly', async () => {
    const stack = makeTarget('toast-stack')
    createConfirmDialog(TextDialog, { text: 'toast' }, { target: stack }).reveal()
    await nextTick()

    expect(stack.textContent).toContain('toast')
  })

  it('keeps dialogs with different targets apart', async () => {
    const stack = makeTarget('toast-stack')
    createConfirmDialog(TextDialog, { text: 'modal' }).reveal()
    createConfirmDialog(TextDialog, { text: 'toast' }, { target: '#toast-stack' }).reveal()
    await nextTick()

    expect(stack.textContent).toContain('toast')
    expect(stack.textContent).not.toContain('modal')
    expect(document.getElementById('vuejs-confirm-dialog-root')!.textContent).toContain('modal')
  })

  it('stacks several dialogs in the same target', async () => {
    const stack = makeTarget('toast-stack')
    createConfirmDialog(TextDialog, { text: 'first' }, { target: '#toast-stack' }).reveal()
    createConfirmDialog(TextDialog, { text: 'second' }, { target: '#toast-stack' }).reveal()
    await nextTick()

    expect(stack.querySelectorAll('.text-dialog')).toHaveLength(2)
  })

  it('removes the dialog from the target on close', async () => {
    const stack = makeTarget('toast-stack')
    const toast = createConfirmDialog(TextDialog, { text: 'toast' }, { target: '#toast-stack' })
    toast.reveal()
    await nextTick()
    toast.close()
    await settleDom()

    expect(stack.textContent).not.toContain('toast')
  })

  it('falls back to the default root with a warning when the target is missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    createConfirmDialog(TextDialog, { text: 'orphan' }, { target: '#nowhere' }).reveal()
    await nextTick()

    expect(document.getElementById('vuejs-confirm-dialog-root')!.textContent).toContain('orphan')
    expect(warn).toHaveBeenCalledOnce()
  })
})

describe('removeDialog()', () => {
  it('ignores an unknown id instead of removing another dialog', () => {
    createConfirmDialog(TextDialog).reveal()
    useDialogWrapper().removeDialog(-1)

    expect(store()).toHaveLength(1)
  })
})

describe('types', () => {
  it('infers reveal data and hook payloads from defineEmits', () => {
    const dialog = createConfirmDialog(TypedDialog)

    expectTypeOf(dialog.reveal).returns.resolves.toEqualTypeOf<RevealResult<typeof TypedDialog>>()
    dialog.onConfirm((value) => expectTypeOf(value).toEqualTypeOf<number>())
    dialog.onCancel((reason) => expectTypeOf(reason).toEqualTypeOf<string>())

    void dialog.reveal().then((result) => {
      if (result.isCanceled) expectTypeOf(result.data).toEqualTypeOf<string | undefined>()
      else expectTypeOf(result.data).toEqualTypeOf<number | undefined>()
    })
  })

  it('infers payloads from object-syntax emits validators', () => {
    const dialog = createConfirmDialog(TextDialog)
    dialog.onConfirm((value) => expectTypeOf(value).toEqualTypeOf<number>())
  })

  it('falls back to any for untyped emits', () => {
    const dialog = createConfirmDialog(DialogComp)
    dialog.onConfirm((value) => expectTypeOf(value).toBeAny())
  })

  it('type-checks props in reveal() and update()', () => {
    const dialog = createConfirmDialog(TypedDialog)
    dialog.update({ count: 1 })
    dialog.reveal({ title: 'ok' })

    // @ts-expect-error - wrong prop type
    dialog.update({ count: 'one' })
    // @ts-expect-error - wrong prop type
    dialog.reveal({ title: 1 })
  })
})

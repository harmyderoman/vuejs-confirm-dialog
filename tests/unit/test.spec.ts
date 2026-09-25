import { createConfirmDialog, install } from './../../src/index'
import { useDialogWrapper } from './../../src/useDialogWrapper'
import { __resetForTests } from './../../src/mountDialogsRoot'
import { useSetup } from '../utils'
import { Component, createApp, defineComponent, h, inject, nextTick } from 'vue'
import { useConfirmDialog } from '@vueuse/core'
import { describe, it, expect, vi } from 'vitest'
import DialogComp from './../components/DialogComp'
import DialogWithDefaults from './../components/DialogWithDefaults.vue'
import { ref } from 'vue'

const INITIAL_MESSAGE = "Initial Message"

const clearDialogsStore = function () {
  const { DialogsStore } = useDialogWrapper()
  while (DialogsStore.length > 0) {
    DialogsStore.pop()
  }
  __resetForTests()
}

describe('Props Behavior Options', () => {
  it('should accept prop options, and do nothing with all options set to false', async () => {

    const { reveal } = createConfirmDialog(DialogComp, 
      { message: INITIAL_MESSAGE}, 
      { chore: false, keepInitial: false }
    )

    const TEST_MESSAGE = 'test message'

    reveal({ message: TEST_MESSAGE })
    await nextTick()
    const { DialogsStore } = useDialogWrapper()

    expect(DialogsStore[0].isRevealed.value).toBe(true)
    expect(DialogsStore[0].props.message).toBe(TEST_MESSAGE)

    DialogsStore[0].confirm()
    await nextTick()
    reveal()
    await nextTick()

    expect(DialogsStore[0].isRevealed.value).toBe(true)
    expect(DialogsStore[0].props.message).toBe(TEST_MESSAGE)

    clearDialogsStore()
  })

  it(`should return to default props values of modal component, 
      if { chore: true, keepInitial: false }`, async () => {

    const { reveal, isRevealed } = createConfirmDialog(DialogComp, 
      { message: INITIAL_MESSAGE }, 
      { chore: true, keepInitial: false }
    )
    const INIT_PROP = 'test prop'
    reveal({ message: INIT_PROP })
    await nextTick()
    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe(INIT_PROP)

    DialogsStore[0].confirm()
    await nextTick()
    expect(isRevealed.value).toBe(false)
    reveal()
    await nextTick()
    expect(isRevealed.value).toBe(true)
    expect(DialogsStore[0].props.message).toBe(undefined)

    clearDialogsStore()
  })
  it(`should return to initial props values passed to create function, 
      if { chore: true, keepInitial: true }`, async () => {

    const { reveal, isRevealed } = createConfirmDialog(DialogComp, 
      { message: INITIAL_MESSAGE }, 
      { chore: true, keepInitial: true }
    )
    const INIT_PROP = 'test prop'
    reveal({ message: INIT_PROP })
    await nextTick()
    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe(INIT_PROP)

    DialogsStore[0].confirm()
    await nextTick()
    expect(isRevealed.value).toBe(false)
    reveal()
    await nextTick()
    expect(isRevealed.value).toBe(true)
    expect(DialogsStore[0].props.message).toBe(INITIAL_MESSAGE)

    clearDialogsStore()
  })
})

describe('createConfirmDialog', () => {
  it('should be defined', () => {
    expect(createConfirmDialog).toBeDefined()
  })

  it('should add Vue component to the DialogsStore', () => {
    const { reveal } = createConfirmDialog(DialogComp)

    reveal()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].dialog).toBe(DialogComp)

    clearDialogsStore()
  })

  it('should set `isRevealed.value` to `true` after call the dialog', () => {
    const { reveal, isRevealed } = createConfirmDialog(DialogComp)
    reveal()

    expect(isRevealed.value).toBe(true)

    clearDialogsStore()
  })

  it('should set `isRevealed.value` to `false` after confirming or canceling the dialog', () => {
    const { reveal, isRevealed } = createConfirmDialog(DialogComp)
    reveal()

    const { DialogsStore } = useDialogWrapper()
    DialogsStore[0].confirm()

    expect(isRevealed.value).toBe(false)

    reveal()
    DialogsStore[0].cancel()

    expect(isRevealed.value).toBe(false)

    clearDialogsStore()
  })

  it('should call `onConfirm` and `onCancel` hooks', () => {
    const { reveal, onConfirm, onCancel } = createConfirmDialog(DialogComp)

    let isCalled = false
    onConfirm(() => {
      isCalled = true
    })
    onCancel(() => {
      isCalled = true
    })

    reveal()
    const { DialogsStore } = useDialogWrapper()
    DialogsStore[0].confirm()

    expect(isCalled).toBe(true)

    isCalled = false
    reveal()
    DialogsStore[0].cancel()
    expect(isCalled).toBe(true)

    clearDialogsStore()
  })

  it('should pass props to component by the second argument', () => {
    const { reveal } = createConfirmDialog(DialogComp, { message: 'message' })
    reveal()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe('message')

    clearDialogsStore()
  })

  it('should pass props to component by `reveal()` argument', () => {
    const { reveal } = createConfirmDialog(DialogComp)
    reveal({ message: 'message' })

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe('message')

    clearDialogsStore()
  })

  it('should return promise on reveil', async () => {
    const { reveal } = createConfirmDialog(DialogComp)

    let isCanceled: boolean | undefined
    const { DialogsStore } = useDialogWrapper()

    reveal().then(result => {
      isCanceled = result.isCanceled
    })

    await nextTick()

    DialogsStore[0].confirm()

    await nextTick()


    expect(isCanceled).toBe(false)

    isCanceled = undefined
    reveal().then(result => {
      isCanceled = result.isCanceled
    })

    await nextTick()
    DialogsStore[0].cancel()
    await nextTick()

    expect(isCanceled).toBe(true)

    clearDialogsStore()
  })

  it('should close dialog without triggering any hook', async () => {
    const dialog = createConfirmDialog(DialogComp)
    let onConfirmTriggered = false
    let onCancelTriggered = false

    dialog.onConfirm(() => {
      onConfirmTriggered = true
    })

    dialog.onCancel(() => {
      onCancelTriggered = true
    })

    dialog.reveal()

    expect(dialog.isRevealed.value).toBe(true)

    await nextTick()

    dialog.close()

    await nextTick()

    expect(dialog.isRevealed.value).toBe(false)
    expect(onConfirmTriggered).toBe(false)
    expect(onCancelTriggered).toBe(false)

    clearDialogsStore()
  })
  it('should close all dialogs', async () => {
    const dialog = createConfirmDialog(DialogComp)
    const dialog2 = createConfirmDialog(DialogComp)

    dialog.reveal()
    dialog2.reveal()

    expect(dialog.isRevealed.value).toBe(true)
    expect(dialog2.isRevealed.value).toBe(true)

    dialog.closeAll()


    expect(dialog.isRevealed.value).toBe(false)
    expect(dialog2.isRevealed.value).toBe(false)

    clearDialogsStore()
  })

})

describe('createConfirmDialog with a component that has default prop values (#31)', () => {
  it('should type-check and reveal with the component defaults when no props are passed', async () => {
    const { reveal } = createConfirmDialog(DialogWithDefaults)

    reveal()
    await nextTick()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.title).toBeUndefined()
    expect(DialogsStore[0].props.message).toBeUndefined()

    clearDialogsStore()
  })

  it('should override the component defaults with passed props', async () => {
    const { reveal } = createConfirmDialog(DialogWithDefaults, { title: 'Custom Title' })

    reveal({ message: 'Custom Message' })
    await nextTick()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.title).toBe('Custom Title')
    expect(DialogsStore[0].props.message).toBe('Custom Message')

    clearDialogsStore()
  })
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('closeDelay option (#34)', () => {
  it('should keep the dialog in DialogsStore until closeDelay elapses after confirm', async () => {
    const dialog = createConfirmDialog(DialogComp, {}, { chore: false, keepInitial: false, closeDelay: 50 })
    dialog.reveal()

    const { DialogsStore } = useDialogWrapper()
    DialogsStore[0].confirm()

    expect(DialogsStore.length).toBe(1)

    await wait(70)
    expect(DialogsStore.length).toBe(0)

    clearDialogsStore()
  })

  it('should keep the dialog in DialogsStore until closeDelay elapses after close()', async () => {
    const dialog = createConfirmDialog(DialogComp, {}, { chore: false, keepInitial: false, closeDelay: 50 })
    dialog.reveal()
    dialog.close()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore.length).toBe(1)

    await wait(70)
    expect(DialogsStore.length).toBe(0)

    clearDialogsStore()
  })

  it('should remove the dialog immediately when closeDelay is not set (default behavior)', () => {
    const dialog = createConfirmDialog(DialogComp)
    dialog.reveal()

    const { DialogsStore } = useDialogWrapper()
    DialogsStore[0].confirm()

    expect(DialogsStore.length).toBe(0)

    clearDialogsStore()
  })
})

describe('auto-mounted dialogs root', () => {
  it('mounts a root into document.body on first reveal and removes it from the DOM on confirm', async () => {
    const { reveal } = createConfirmDialog(DialogWithDefaults, { title: 'Auto Mount Test' })
    reveal({ message: 'hello from auto mount' })
    await nextTick()

    const container = document.getElementById('vuejs-confirm-dialog-root')
    expect(container).not.toBeNull()
    expect(container!.textContent).toContain('hello from auto mount')

    const { DialogsStore } = useDialogWrapper()
    DialogsStore[0].confirm()
    // DialogsRoot renders the list through <TransitionGroup>, which defers
    // the actual DOM removal through its leave lifecycle even with no CSS
    // transition defined - a couple of ticks/a short wait covers that.
    await nextTick()
    await nextTick()
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(container!.textContent).not.toContain('hello from auto mount')

    clearDialogsStore()
  })

  it('lets dialog components inject values provided by the host app via install()', async () => {
    const app = createApp({ render: () => null })
    app.provide('testInjectionKey', 'injected-value')
    install(app)

    const InjectingDialog = defineComponent({
      name: 'InjectingDialog',
      emits: ['confirm', 'cancel'],
      setup() {
        const value = inject('testInjectionKey', 'fallback')
        return () => h('div', value as string)
      },
    })

    const { reveal } = createConfirmDialog(InjectingDialog)
    reveal()
    await nextTick()

    const container = document.getElementById('vuejs-confirm-dialog-root')
    expect(container!.textContent).toContain('injected-value')

    clearDialogsStore()
  })

  it('still renders dialogs without install() called, just without inherited context', async () => {
    const { reveal } = createConfirmDialog(DialogComp)
    reveal()
    await nextTick()

    const container = document.getElementById('vuejs-confirm-dialog-root')
    expect(container).not.toBeNull()

    clearDialogsStore()
  })

  it('does not throw when reveal() happens without a document (SSR), and mounts for real afterwards', async () => {
    vi.stubGlobal('document', undefined)

    let threw = false
    const { reveal } = createConfirmDialog(DialogComp)
    try {
      reveal()
    } catch {
      threw = true
    }
    expect(threw).toBe(false)

    vi.unstubAllGlobals()

    // simulates hydration completing: the next reveal() should mount for real
    reveal()
    await nextTick()

    expect(document.getElementById('vuejs-confirm-dialog-root')).not.toBeNull()

    clearDialogsStore()
  })
})

describe('useDialogWrapper', () => {
  it('should be defined', () => {
    expect(useDialogWrapper).toBeDefined()
  })


  it('should add Vue component to the DialogsStore', async () => {
    const simpleComponent = {} as Component
    const props = {}

    const wrapper = useSetup(() => {
      const { DialogsStore, addDialog } = useDialogWrapper()
      const { isRevealed, confirm, cancel } = useConfirmDialog()
      addDialog({
        dialog: simpleComponent,
        isRevealed,
        confirm,
        cancel,
        props,
        id: 0,
        close: function (): void {
          throw new Error('Function not implemented.')
        },
        revealed: ref(false)
      })

      return { DialogsStore }
    })

    expect(wrapper.DialogsStore[0].dialog).toBe(simpleComponent)

    clearDialogsStore()
  })
})

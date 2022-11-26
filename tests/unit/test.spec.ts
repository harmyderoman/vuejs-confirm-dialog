import { ComponentProps, DialogsWrapper, createConfirmDialog } from './../../src/index'
import { useDialogWrapper } from './../../src/useDialogWrapper'
import { useSetup } from '../utils'
import { Component, nextTick, defineComponent } from 'vue'
import { useConfirmDialog } from '@vueuse/core'
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DialogComp from './../components/DialogComp'
import { ref } from 'vue'

const DEFAULT_MESSAGE = "Default Message"
const INITIAL_MESSAGE = "Initial Message"

const ModalDialog = defineComponent({
  name: 'ModalDialog',
  props: {
    message: {
      type: String,
      default: DEFAULT_MESSAGE
    }
  },
  emits: ['confirm', 'cancel']
})

const clearDialogsStore = function () {
  const { DialogsStore } = useDialogWrapper()
  while (DialogsStore.length > 0) {
    DialogsStore.pop()
  }
}

describe('Props Behavior Options', () => {
  it('should accept prop options, and do nothing with all options set to false', async () => {

    const { reveal } = createConfirmDialog(ModalDialog, 
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

    const { reveal, isRevealed } = createConfirmDialog(ModalDialog, 
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

    const { reveal, isRevealed } = createConfirmDialog(ModalDialog, 
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
    const { reveal } = createConfirmDialog(ModalDialog)

    reveal()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].dialog).toBe(ModalDialog)

    clearDialogsStore()
  })

  it('should set `isRevealed.value` to `true` after call the dialog', () => {
    const { reveal, isRevealed } = createConfirmDialog(ModalDialog)
    reveal()

    expect(isRevealed.value).toBe(true)

    clearDialogsStore()
  })

  it('should set `isRevealed.value` to `false` after confirming or canceling the dialog', () => {
    const { reveal, isRevealed } = createConfirmDialog(ModalDialog)
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
    const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalDialog)

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
    DialogsStore[0].cancel()
    expect(isCalled).toBe(true)

    clearDialogsStore()
  })

  it('should pass props to component by the second argument', () => {
    const { reveal } = createConfirmDialog(ModalDialog, { message: 'message' })
    reveal()

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe('message')

    clearDialogsStore()
  })

  it('should pass props to component by `reveal()` argument', () => {
    const { reveal } = createConfirmDialog(ModalDialog)
    reveal({ message: 'message' })

    const { DialogsStore } = useDialogWrapper()
    expect(DialogsStore[0].props.message).toBe('message')

    clearDialogsStore()
  })

  it('should return promise on reveil', async () => {
    const { reveal } = createConfirmDialog(ModalDialog)

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
    const dialog = createConfirmDialog(ModalDialog)
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
    const dialog = createConfirmDialog(ModalDialog)
    const dialog2 = createConfirmDialog(ModalDialog)

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

describe('DialogsWrapper.vue', () => {
  it('should be defined', () => {
    expect(DialogsWrapper).toBeDefined()

    clearDialogsStore()
  })

  it('should mount component to the document', async () => {
    const wrapper = mount(DialogsWrapper)

    const { addDialog } = useDialogWrapper()
    const { isRevealed, confirm, cancel } = useConfirmDialog()
    addDialog({
      dialog: DialogComp,
      isRevealed,
      confirm,
      cancel,
      props: {},
      id: 0,
      close: function (): void {
        throw new Error('Function not implemented.')
      },
      revealed: ref(false)
    })

    await nextTick()

    const modal = wrapper.findComponent(DialogComp)
    expect(modal.exists()).toBe(true)

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

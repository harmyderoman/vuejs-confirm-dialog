import { PropsData, useDialogWrapper } from './../../src/index'
import DialogsWrapper from '../../src/DialogsWrapper.vue'
import { useSetup } from '../utils'
import { Component } from 'vue-demi'
import { useConfirmDialog } from '@vueuse/core'

describe('DialogsWrapper.vue', () => {
  it('should be defined', () => {
    expect(DialogsWrapper).toBeDefined()
  })
})

describe('useDialogWrapper', () => {
  it('should be defined', () => {
    expect(useDialogWrapper).toBeDefined()
  })

  it('should add Vue component to the DialogsStore', () => {
    const simpleComponent = {} as Component
    const props = {} as PropsData

    const wrapper = useSetup(() => {
      const { DialogsStore, addDialog } = useDialogWrapper()
      const { isRevealed, confirm, cancel } = useConfirmDialog()
      addDialog({
        component: simpleComponent,
        isRevealed,
        confirm,
        cancel,
        props,
      })

      return { DialogsStore }
    })

    expect(wrapper.DialogsStore[0].component).toBe(simpleComponent)
  })
})

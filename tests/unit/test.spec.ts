import { PropsData, DialogsWrapper} from './../../src/index'
import { useDialogWrapper } from './../../src/useDialogWrapper'
import { useSetup } from '../utils'
import { Component } from 'vue-demi'
import { useConfirmDialog } from '@vueuse/core'
import { describe, it, expect } from 'vitest'

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
        dialog: simpleComponent,
        isRevealed,
        confirm,
        cancel,
        props,
        id: 0
      })

      confirm()

      return { DialogsStore }
    })

    expect(wrapper.DialogsStore[0].dialog).toBe(simpleComponent)
  })
})

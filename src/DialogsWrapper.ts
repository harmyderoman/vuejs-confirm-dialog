import { h } from 'vue'
import { useDialogWrapper } from './useDialogWrapper'
import { defineComponent } from 'vue-demi'

/**
 * `DialogsWrapper` - the component that contains all
 * modal dialogs of the app
 */
export default defineComponent({
  name: 'DialogsWrapper',
  setup() {
    const { DialogsStore } = useDialogWrapper()

    return () => DialogsStore.map(dialogData => {
      return h(dialogData.dialog, { 
        is: dialogData.dialog,
        onConfirm: dialogData.confirm,
        onCancel: dialogData.cancel,
        key: dialogData.id,
        ...dialogData.props
      })
    })
  }
})
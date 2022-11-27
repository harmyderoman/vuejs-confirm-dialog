import { defineComponent, h } from "vue"

const DEFAULT_MESSAGE = "Default Message"

 const DialogComp = defineComponent({
  emits: ['confirm', 'cancel'],
  props: {
    message: {
      type: String,
      default: DEFAULT_MESSAGE
    }
  },
  render() {
    return h('div')
  }
})

export default DialogComp
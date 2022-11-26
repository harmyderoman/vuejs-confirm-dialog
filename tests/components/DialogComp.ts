import { defineComponent, h } from "vue"

export default defineComponent({
  emits: ['confirm', 'cancel'],

  render() {
    return h('div')
  }
})
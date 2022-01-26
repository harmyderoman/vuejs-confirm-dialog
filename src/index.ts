import {
  createConfirmDialog,
  PropsData,
  CreateConfirmDialogFnReturn,
} from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper.vue'
import { App } from 'vue-demi'

function install(app: App) {
  app.component('DialogsWrapper', DialogsWrapper)
}

export { createConfirmDialog, DialogsWrapper, install }
export type { PropsData, CreateConfirmDialogFnReturn }

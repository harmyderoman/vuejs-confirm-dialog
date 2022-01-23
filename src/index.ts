import {
  createConfirmDialog,
  PropsData,
  CreateConfirmDialogFnReturn,
} from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper.vue'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function install(app: any) {
  app.component('DialogsWrapper', DialogsWrapper)
}

export { createConfirmDialog, DialogsWrapper, install }
export type { PropsData, CreateConfirmDialogFnReturn }

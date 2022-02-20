import {
  createConfirmDialog,
} from './createConfirmDialog'
import type { UseDialogWrapperReturn, DialogData } from './useDialogWrapper'
import type { PropsData, CreateConfirmDialogFnReturn } from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper.vue'
import { App } from 'vue-demi'

function install(app: App) {
  app.component('DialogsWrapper', DialogsWrapper)
}

export { 
  createConfirmDialog, 
  DialogsWrapper, 
  install, 
  PropsData, 
  CreateConfirmDialogFnReturn, 
  UseDialogWrapperReturn, 
  DialogData 
}

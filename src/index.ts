import { createConfirmDialog } from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper.vue'

import type { UseDialogWrapperReturn, DialogData } from './useDialogWrapper'
import type { PropsData } from './createConfirmDialog'
import { App } from 'vue-demi'

function install(app: App) {
  app.component('DialogsWrapper', DialogsWrapper)
}

export { 
  createConfirmDialog, 
  DialogsWrapper, 
  install, 
  PropsData,
  UseDialogWrapperReturn, 
  DialogData 
}

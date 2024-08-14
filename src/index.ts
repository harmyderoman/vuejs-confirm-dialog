import { createConfirmDialog } from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper'

import type { UseDialogWrapperReturn, DialogData } from './useDialogWrapper'
import type { ComponentProps } from './createConfirmDialog'
import { App } from 'vue-demi'

function install(app: App) {
  app.component('DialogsWrapper', DialogsWrapper)
}

export { 
  createConfirmDialog, 
  DialogsWrapper, 
  install, 
  ComponentProps,
  UseDialogWrapperReturn, 
  DialogData 
}

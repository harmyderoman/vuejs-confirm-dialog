import { createConfirmDialog } from './createConfirmDialog'
import DialogsWrapper from './DialogsWrapper.vue'
import ModalBox from './ModalBox.vue'

import type { UseDialogWrapperReturn, DialogData } from './useDialogWrapper'
import type { ComponentProps } from './createConfirmDialog'
import { App } from 'vue-demi'

function install(app: App) {
  app.component('DialogsWrapper', DialogsWrapper)
  app.component('modal-box', ModalBox)
}

export { 
  createConfirmDialog, 
  DialogsWrapper, 
  ModalBox,
  install, 
  ComponentProps,
  UseDialogWrapperReturn, 
  DialogData 
}

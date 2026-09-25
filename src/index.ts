import { createConfirmDialog } from './createConfirmDialog'
import { setHostApp } from './mountDialogsRoot'

import type { UseDialogWrapperReturn, DialogData } from './useDialogWrapper'
import type { ComponentProps } from './createConfirmDialog'
import { App } from 'vue'

function install(app: App) {
  setHostApp(app)
}

export {
  createConfirmDialog,
  install,
  ComponentProps,
  UseDialogWrapperReturn,
  DialogData,
}

import { createConfirmDialog } from './createConfirmDialog'
import { setHostApp } from './mountDialogsRoot'

import type {
  UseDialogWrapperReturn,
  DialogData,
  DialogTarget,
} from './useDialogWrapper'
import type {
  ComponentProps,
  ConfirmDialog,
  ConfirmDialogOptions,
  EmitPayload,
  ResetPropsMode,
  RevealResult,
} from './createConfirmDialog'
import { App } from 'vue'

function install(app: App) {
  setHostApp(app)
}

export {
  createConfirmDialog,
  install,
  ComponentProps,
  ConfirmDialog,
  ConfirmDialogOptions,
  EmitPayload,
  ResetPropsMode,
  RevealResult,
  DialogTarget,
  UseDialogWrapperReturn,
  DialogData,
}

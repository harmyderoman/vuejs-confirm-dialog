import { createConfirmDialog } from './../../../src/index'
import Alert from '../components/Alert.vue'

export const useAlertMessage = function () {
  // one instance per alert: a single instance is a single open dialog,
  // so several alerts on screen at once need separate instances
  return function (msg: string) {
    createConfirmDialog(Alert, { message: msg }, { target: '#toast-stack' }).reveal()
  }
}

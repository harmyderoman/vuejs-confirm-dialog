import { createConfirmDialog } from './../../../src/createConfirmDialog';
import Alert from '../components/Alert.vue'

export const useAlertMessage = function(){

  return function (msg: any) {
    const { reveal } = createConfirmDialog(Alert, { message: msg})
    
    reveal()
  }
}
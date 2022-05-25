import Loader from './../components/Loader.vue'
import { createConfirmDialog } from './../../../src/index'

const loader = createConfirmDialog(Loader)
export const useLoader = (cb: () => any) => {

  const start = () => {
    loader.reveal({ process: cb })
  } 

  return {
    start,
    onLoaded: loader.onConfirm
  }
}


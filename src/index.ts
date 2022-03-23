import NumericInput from './vue-numeric-input-next.vue'
import { name, version } from '../package.json'
import { App } from 'vue'

function install (app: App) {
  app.component(NumericInput.name, NumericInput)
}

export default {
  name,
  version,
  install
}

export const VueNumericInputNext = NumericInput


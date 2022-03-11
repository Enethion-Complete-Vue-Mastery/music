import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage
} from 'vee-validate'
import {
  required,
  min,
  max,
  alpha,
  email,
  confirmed,
  integer,
  min_value as minValue,
  max_value as maxValue,
  not_one_of as excluded
} from '@vee-validate/rules'

export default {
  install (app) {
    app.component('VeeForm', VeeForm)
    app.component('VeeField', VeeField)
    app.component('ErrorMessage', ErrorMessage)

    defineRule('required', required)
    defineRule('min', min)
    defineRule('max', max)
    defineRule('min_value', minValue)
    defineRule('max_value', maxValue)
    defineRule('alpha', alpha)
    defineRule('email', email)
    defineRule('confirmed', confirmed)
    defineRule('integer', integer)
    defineRule('excluded', excluded)
  }
}

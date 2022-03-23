<script lang="ts">
export default {
  name: 'vue-numeric-input-next'
}
</script>
<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch, PropType, onMounted } from 'vue'
const props = defineProps({
  name: String,
  modelValue: [String, Number] as PropType<string | number | null>,
  placeholder: String,
  min: {
    type: Number,
    default: Number.MIN_SAFE_INTEGER
  },
  max: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER
  },
  step: {
    type: Number,
    default: 1
  },
  align: {
    type: String,
    default: 'left'
  },
  width: {
    type: String
  },
  size: {
    type: String,
    default: 'normal',
    validator (val: string) {
      return ['small', 'normal', 'large'].includes(val)
    }
  },
  precision: {
    type: Number,
    validator (val: number) {
      return val >= 0 && Number.isInteger(val)
    }
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  controls: {
    type: Boolean,
    default: true
  },
  controlsType: {
    type: String,
    default: "plusminus"
  },
  mousewheel: {
    type: Boolean,
    default: false
  },
  isInput: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: null
  }
})
const emits = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const timeInterval = 100

const newValue = ref(<number | string>0)
const minDisable = ref(false)
const maxDisable = ref(false)
const interval = ref(<null | number>null)
const startTime = ref(<null | number>null)
const handler = ref(Function)

const input = ref(<HTMLInputElement | null>null)

const computedValue = computed({
  get () {
    return newValue.value
  },
  set (value: any) {
    newValue.value = value
    emits('update:modelValue', value)
  }
})

const numValuePrecision = computed(() => {
  const stepPrecision = getPrecision(props.step)
  if (props.precision !== undefined) {
    return props.precision
  } else {
    return Math.max(getPrecision(computedValue.value || 0), stepPrecision)
  }
})

const inputClasses = computed(() => {
  return [
    props.controls ? '' : 'no-control',
    props.className ? props.className : '',
    'numeric-input'
  ]
})

const inputStyle = computed(() => {
  return {
    textAlign: props.align
  } as any
})

const widthStyle = computed(() => {
  let sizeWidth = '150px'
  if (props.size === 'small') {
    sizeWidth = '100px'
  } else if (props.size === 'large') {
    sizeWidth = '240px'
  }
  return {
    width: props.width ? `${props.width}` : sizeWidth
  }
})

watch(() => props.modelValue, (val: any) => {
  init(val)
})

onMounted(() => {
  init(props.modelValue)
  if (props.precision && props.precision !== getPrecision(newValue.value as number)) {
    newValue.value = Number(newValue.value).toFixed(props.precision)
    emits('update:modelValue', newValue.value)
  }
})

function init (val: any) {
  if (props.max && val as number >= props.max) {
    newValue.value = props.max
  } else if (props.min && val as number <= props.min) {
    newValue.value = props.min
  } else {
    newValue.value = val as number
  }
  if (newValue.value !== val) {
    emits('update:modelValue', newValue.value)
  }
}

function toNumber (val: any) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

function toPrecision (val: number, precision: number) {
  return parseFloat(
    (Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision)).toString()
  )
}

function getPrecision (value = 0) {
  const valueString = value.toString()
  const dotPosition = valueString.indexOf('.')
  let precision = 0
  if (dotPosition !== -1) {
    precision = valueString.length - dotPosition - 1
  }
  return precision
}

function increment () {
  if (!props.readonly && !props.disabled) {
    const val = computedValue.value || 0
    const precisionFactor = Math.pow(10, numValuePrecision.value)
    const newVal = Math.round(precisionFactor * val + precisionFactor * props.step) / precisionFactor
    if (newVal <= props.max) {
      minDisable.value = false
      computedValue.value = newVal
    } else {
      maxDisable.value = true
    }
  }
}

function decrement () {
  if (!props.readonly && !props.disabled) {
    const val = computedValue.value || 0
    const precisionFactor = Math.pow(10, numValuePrecision.value)
    const newVal = Math.round(precisionFactor * val - precisionFactor * props.step) / precisionFactor
    if (newVal >= props.min) {
      maxDisable.value = false
      computedValue.value = newVal
    } else {
      minDisable.value = true
    }
  }
}

function onInput (event: Event) {
  nextTick(() => {
    if (event.target) {
      computedValue.value = (event.target as HTMLInputElement).value
    }
  })
}

function start (handlerinput: any) {
  document.addEventListener('mouseup', stop)
  startTime.value = new Date().getTime()
  handler.value = handlerinput
  clearInterval(interval.value as any)
  interval.value = setInterval(handlerinput, timeInterval)
}

function stop (evt: Event) {
  document.removeEventListener(evt.type, stop)
  if (new Date().getTime() - Number(startTime.value) < timeInterval) {
    handler.value()
  }
  clearInterval(interval.value as any)
  interval.value = null
  handler.value = Function
  startTime.value = null
  if (props.modelValue !== computedValue.value) {
    emits('change', computedValue.value)
  }
}

function onBlur (event: Event) {
  let val = toNumber((event.target as HTMLInputElement).value)
  if (props.precision) {
    val = val.toFixed(props.precision)
  }
  console.log(val)
  emits('update:modelValue', val)
  emits('blur', event)
}

function onFocus (event: Event) {
  emits('focus', event)
}

function onChange (event: Event) {
  emits('change', computedValue.value)
}

function focus () {
  if (!props.disabled) {
    input.value?.focus()
  }
}

function blur () {
  if (!props.disabled) {
    input.value?.blur()
  }
}

function mouseWheelHandler (event: WheelEvent) {
  event.preventDefault()
  event.stopImmediatePropagation()
  if (event.deltaY < 0) {
    increment()
  } else {
    decrement()
  }
  return false
}

type ThrottleFunc = (...args: any[]) => void

function throttle (fn: ThrottleFunc, delay: number) {
  let lastCall = 0
  return function (...args: any[]) {
    const now = new Date().getTime()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return fn(...args)
  }
}

onBeforeUnmount(() => {
  interval.value && clearInterval(interval.value)
  interval.value = null
  handler.value = Function
  startTime.value = null
})
</script>

<template>
<div
  :class="[
    'vue-numeric-input',
    size,
    controlsType === 'updown' ? 'updown' : ''
  ]"
  :style="widthStyle"
>
  <input
    :name="name"
    ref="input"
    type="number"
    step="any"
    :class="inputClasses"
    :value="computedValue"
    :placeholder="placeholder"
    :max="max"
    :min="min"
    :style="inputStyle"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    :autofocus="autofocus"
    :disabled="disabled"
    :readonly="readonly || !isInput"
    v-bind="$attrs"
    v-on="
      mousewheel
        ? { wheel: throttle(mouseWheelHandler, 6000) }
        : {
            wheel: function(evt: Event) {
              evt.preventDefault();
            }
          }
    "
  />
  <button
    type="button"
    v-if="controls"
    class="input-btn btn-decrement"
    @mousedown.left="start(decrement)"
    @touchstart.prevent="start(decrement)"
    @touchend.prevent="stop"
    :disabled="disabled || minDisable"
  >
    <span class="btn-icon"></span>
  </button>
  <button
    type="button"
    v-if="controls"
    class="input-btn btn-increment"
    @mousedown.left="start(increment)"
    @touchstart.prevent="start(increment)"
    @touchend.prevent="stop"
    :disabled="disabled || maxDisable"
  >
    <span class="btn-icon"></span>
  </button>
</div>
</template>

<style>
.vue-numeric-input {
  position: relative;
  box-sizing: border-box;
  height: 1.8rem;
}
.vue-numeric-input.small {
  height: 20px;
  font-size: 12px;
}
.vue-numeric-input.small .numeric-input {
  padding: 2px 1.4rem;
}
.vue-numeric-input.large {
  height: 42px;
  font-size: 34px;
}
.vue-numeric-input.large .numeric-input {
  padding: 2px 2.8rem;
}
.vue-numeric-input .numeric-input {
  height: inherit;
  padding: 2px 2rem;
  box-sizing: border-box;
  font-size: inherit;
  border: 1px solid #cccccc;
  border-radius: 2px;
  display: block;
  line-height: 1.8rem;
  transition: all 0.1s ease 0s;
  width: 100%;
  -moz-appearance: textfield !important;
}
.numeric-input::-webkit-inner-spin-button, .numeric-input::-webkit-outer-spin-button  {
  -webkit-appearance: none !important;
  margin: 0 !important;
}
.vue-numeric-input .numeric-input:focus {
  outline: none;
  border-color: #409eff;
}
.vue-numeric-input button {
  position: absolute;
  width: 1.8rem;
  padding: 0.2rem;
  margin: 0;
  cursor: pointer;
  text-align: center;
  transition: all 0.1s ease 0s;
  background: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.1);
  box-shadow: rgba(0, 0, 0, 0.1) -1px -1px 3px inset,
    rgba(255, 255, 255, 0.7) 1px 1px 3px inset;
}
.vue-numeric-input button:focus {
  outline: none !important;
}
.vue-numeric-input.small button {
  width: 20px;
}
.vue-numeric-input.large button {
  width: 40px;
}
.vue-numeric-input button:hover {
  background: rgba(0, 0, 0, 0.2);
}
.vue-numeric-input button:active {
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 3px inset,
    rgba(255, 255, 255, 0.5) -1px -1px 4px inset;
}
.vue-numeric-input button:disabled {
  opacity: 0.5;
  box-shadow: none;
  cursor: not-allowed;
}
.vue-numeric-input .numeric-input.no-control {
  padding: 2px 5px;
}
.vue-numeric-input .btn-increment {
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  border-width: 1px;
}
.vue-numeric-input .btn-increment .btn-icon {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.vue-numeric-input .btn-increment .btn-icon:before {
  display: inline-block;
  visibility: visible;
  content: "";
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='CurrentColor' viewBox='0 0 16 16'><path d='M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z'/></svg>");
  background-repeat: no-repeat;
  background-size: 65% 65%;
  background-position: center;
  width: 100%;
  height: 100%;
}
.vue-numeric-input .btn-increment .btn-icon:after {
  position: absolute;
  visibility: hidden;
  content: "";
}
.vue-numeric-input .btn-decrement {
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  border-width: 1px;
}
.vue-numeric-input .btn-decrement .btn-icon {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.vue-numeric-input .btn-decrement .btn-icon:before {
  display: inline-block;
  visibility: visible;
  content: "";
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 16'><path d='M0 8a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1z'/></svg>");
  background-repeat: no-repeat;
  background-size: 65% 65%;
  background-position: center;
  width: 100%;
  height: 100%;
}
.vue-numeric-input .btn-decrement .btn-icon:after {
  visibility: hidden;
  content: "";
  clear: both;
  height: 0;
}
.vue-numeric-input.updown .numeric-input {
  padding: 5px 2rem 5px 5px;
}
.vue-numeric-input.updown .btn-increment {
  right: 0;
  top: 0;
  bottom: 50%;
  border-radius: 2px 2px 0 0;
  border-width: 1px 1px 0;
}
.vue-numeric-input.updown .btn-increment .btn-icon {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-width: 0 0.45rem 0.45rem;
  border-color: transparent transparent #111;
  border-style: solid;
  margin: -0.25rem 0 0 -0.4rem;
}
.vue-numeric-input.updown .btn-increment .btn-icon::before {
  visibility: hidden;
  display: block;
  content: "";
  clear: both;
  height: 0;
}
.vue-numeric-input.updown .btn-decrement .btn-icon::before {
  content: "";
}
.vue-numeric-input.updown .btn-increment .btn-icon::after {
  visibility: hidden;
  display: block;
  content: "";
  clear: both;
  height: 0;
}
.vue-numeric-input.updown .btn-decrement {
  right: 0;
  top: 50%;
  bottom: 0;
  left: auto;
  border-radius: 0 0 2px 2px;
  border-width: 0 1px 1px;
}
.vue-numeric-input.updown .btn-decrement .btn-icon {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-width: 0.45rem 0.45rem 0;
  border-color: #111 transparent transparent;
  border-style: solid;
  margin: -0.25rem 0 0 -0.4rem;
}
</style>
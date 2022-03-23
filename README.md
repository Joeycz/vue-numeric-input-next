# Vue Numeric Input Next

Number input component based on Vue3 that is a replacement of native input number with optional control.

### Installation

Install via NPM

`$ npm install vue-numeric-input-next` 

or 

`$ yarn add vue-numeric-input-next`


#### Global

Register VueNumericInput globally:

```js
import { createApp } from 'Vue';
import VueNumericInput from 'vue-numeric-input-next';

const app = createApp()
app.use(VueNumericInput)
```

#### Local

Include the VueNumericInput  directly into your component using import:

```js
import { VueNumericInputNext } from 'vue-numeric-input-next'
```
### Usage

#### Basic usage

```html
<template>
  <vue-numeric-input-next  v-model="value" :min="1" :max="10" :step="2"></vue-numeric-input-next>
</template>

<script setup>
import { ref } from 'vue'
const value = ref(0)
</script>
```

#### PROPS:

| Name             | Description                 |  Type         |  Default     | Options       |
| -----------      | ---------------             | ------------  | ------------ | ------------  |
|  name            |  Component name             | String        |     -        |      -        |
|  value           |  Binding value              | Number        |     -        |      -            |
|  placeholder     |  Input placeholder          | String        |     -        |      -         |
|  min             |  Minimum allowed value      | Number        |  -Infinity   |      -        |
|  max             |  Maximum allowed value      | Number        |   Infinity   |      -          |
|  step            |  Incremental Step           | Number        |      1       |      -          |
|  align           |  Alignment of Numeric Value | String        |     left     | left, center, right |
|  width           |  Component Width             | String        |   150px     | width in px, em, rem etc e.g. ‘20px’ |
|  size            |  Component Size             | String        |   normal     | size value can be 'small', 'normal', 'large' |
|  precision       |  Number of decimals         | Number        |      0       |   Integer value|
|  controls        |  Enable/Disable Controls    | Boolean       |    true      |   true/false|
|  controlsType    |  Controls Type              | String        |  plusminus   |   plusminus/updown|
|  autofocus       |  Autofocus on Page Load     | Boolean       |    false     |   true/false|
|  readonly        |  Is Readonly                | Boolean       |    false     |   true/false|
|  disabled        |  Is Disabled                | Boolean       |    false     |   true/false|
|  isinput        |  enable/disable keyboard input of number | Boolean  |    false      |   true/false|
|  mousewheel      |  Enable increment/decrement with mousewheel event  | Boolean       |    false     |   true/false|
|  className       |  Css Class for Input Component | String        |   -     | css class name |


#### EVENTS:

Event Name | Description        | Parameters
-----------|--------------------|--------------
update:modelValue      | triggers when input| (newValue)
change     | triggers when the value changes| (newValue)
blur       | triggers when Input blurs| (event: Event)
focus      | triggers when Input focus| (event: Event)


#### METHODS:

Method | Description | Parameters
---|--- | ----
focus | focus the Input component| -
blur | blur the Input component| -

Inspired by [vue-numeric-input](https://github.com/JayeshLab/vue-numeric-input)

## License

MIT
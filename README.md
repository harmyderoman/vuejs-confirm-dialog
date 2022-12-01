# vuejs-confirm-dialog

This package just makes it simple to create, reuse, promisify and build chains of modal dialogs in Vue.js. For now, it provides just one function `createConfirmDialog` that does all the hard work for you.

## About

How does it work? The idea is simple, this function -- `createConfirmDialog` gets a modal component and magically provides to it emits `confirm` and `cancel` and its props values. This function returns to you a dialog instance that controls the rendering of the modal component and reacts to user decisions. It reduces you to write all the boilerplate code over and over again and makes it simple to reuse your modals everywhere in your project.

You can work with dialogs like with promises or with hooks that the dialog instance generates for you.

## Installation

in 3 steps

### Step 0

Add the package to your `node_modules`

```bash
npm i vuejs-confirm-dialog
```

### Step 1

Install the plugin:

```js
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import * as ConfirmDialog from 'vuejs-confirm-dialog'

createApp(App).use(ConfirmDialog).mount('#app')
```

### Step 2

Add `DialogsWrapper` to `App.vue` template:

```html
<!-- App.vue -->
<template>
  <div class="app">
  </div>

  <!-- put it in the template of your App.vue file to make dialogs work -->
  <!-- Don't need import the component, if you installed the plugin -->
  <DialogsWrapper />
</template>
```

And that's it. Now you can use it.

## Usage

Build Modal Window. It must contain emits `confirm` and `cancel`. ~~It also must contain~~ ~~prop `show`~~. ~~Put `v-if="show"` in its template for conditional rendering~~(no longer need to).

```html
<!-- ModalDialog.vue -->
<script setup>
  const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div>
    <!-- The modal component body -->
    <button @click="emit('confirm')">Confirm</button>
    <button @click="emit('cancel')">Cancel</button>
  </div>
</template>
```

Use this modal window wherever you want in your project:

```html
<!-- App.vue -->
<script setup>
import ModalDialog from './ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

const { reveal, onConfirm, onCancel } = createConfirmDialog(ModalDialog)

reveal()

onConfirm(() => {
  console.log('Confirmed!')
})
onCancel(() => {
  console.log('Canceled!')
})
</script>
```

### Two ways of usage

The package lets you decide how to use it. The first way is to use hooks:

- `onConfirm` - hook gets a callback that runs after the user confirmed the modal message
- `onCancel` - run callback if the user decides to click cancel

The second way is promisify modal dialog. `reveal` the function returns a Promise, that resolves data and `isCanceled` boolean from the dialog after the user commits the action.

for example(not real):

```html
<script setup>
import ModalDialog from './ModalDialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

const dialog = createConfirmDialog(ModalDialog)

const confirmDelete = async () => {
  const { data, isCanceled } = await dialog.reveal()

  if(isCanceled) return
  
  deleteYourData(data)
}
</script>
```

## Passing data to/from the dialog

It will be not so useful if we will not have the option to pass data to and from а component.
There are several ways to deal with it. First of all, you can pass data to the second argument of the `createConfirmDialog` function. Data must be an object with names of properties matching to props of the component you use as dialog. For example, if a component has a prop with the name `title` we have to pass this `{ title: 'Some Title' }`. So these will be the initial props that the dialog component will receive.

You can change props values during the calling `reveal` function by passing to its object with props data. So you can call the `reveal` function several times with different props. This is an excellent way to reuse the same dialog in different situations.

And finally, you can pass data to emit functions inside your modal dialog component: `confirm` and `cancel`. Hooks `onConfirm` and `onCancel` will receive this data. Also, it will be passed by Promise, so you can use the async/await syntax if you prefer.

The full example, that displays passing data, reusing, and modal chains:

```html
<script setup>
import LoginDialog from './LoginDialog.vue'
import InfoModal from './InfoModal.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'
import { ref } from 'vue'

const loginDialog = createConfirmDialog(LoginDialog)
const infoModal = createConfirmDialog(InfoModal, { title: 'Some Title' })

const user = ref(null)

const login = async () => {
  const result = await infoModal.reveal({ title: 'Please log in to the system' })

  if(!result.isCanceled) {
    const { data, isCanceled } = await loginDialog.reveal()
    if(!isCanceled) {
      user.value = data

      infoModal.reveal({ title: 'You have successfully logged in.' })
    } else {
      infoModal.reveal({ title: 'You were unable to log in and will not be able to access your data.' })
    }
  }
}
</script>
```

## Props Behavior Options

Unfortunately, the way of passing props is not so clear to the developers. The problem occurs when you try to reuse a dialog instance already created with `createConfirmDialog`. See also the [issue](https://github.com/harmyderoman/vuejs-confirm-dialog/issues/21).

Let's consider this process step by step. Props values ​​are assigned three times, the first time is default props values, in the component, this package does not show up on them in any way. The second time occurs on creating an instance of the dialog, let's define these values ​​as initial props. The third time passing values ​​is possible when the user prompts the dialog using the `reveal` method. If you don't set the props behavior options, then each time you pass values, this data will be saved.

For example, if you have an alert component and you called it with the message "Authorization failed!", then next time if you don't pass a new message value, it will show this message again.

Perhaps it will be convenient if every time after closing the dialog, the values ​​of the props will be reset to the initial or even default values. For this functionality, props transfer settings have been added.

There are only two options:

- `chore` - if `true` will tell to function reset values after closing dialog
- `keepInitial` - if `true` reset props values to initial values, otherwise to default values of the component

The simplest example:

```javascript
  const dialog = createConfirmDialog(
    ModalComponent,
    { message: 'Some message...' }, // Initial props values
    { chore: true, keepInitial: true }
  )
```
## Using inside Options API

If you prefer you can use it with Options API inside methods.

```javascript
import Dialog from './Dialog.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

export default {
  data(){
    return {
      isConfirmed: false
    }
  },
  methods: {
    showDialog(){
      const dialog = createConfirmDialog(Dialog)

      dialog.onConfirm(() => {
        this.isConfirmed = true
      })

      dialog.reveal()
    }
  }
}
```

For more info check this full Vue 3 [example](https://github.com/harmyderoman/vuejs-confirm-dialog/blob/main/demos/vue3).

## Close dialogs programmable

Sometimes you need to close dialogs and don't want to wait for the user's action. For these purposes, dialog instance provides method `close`.

```javascript
import Alert from './Alert.vue'
import { createConfirmDialog } from 'vuejs-confirm-dialog'

const dialog = createConfirmDialog(Alert)

dialog.reveal()

setTimeout(() => {
  dialog.close()
}, 3000)
```

It also doesn't trigger any hooks.

If you need to close all dialog just call `dialog.closeAll()`.


## Demo

Clone the project, install dependencies and run the following command to see the demo:

```bash
pnpm run demo
```

The demo is styled by beautiful [daisyUI](https://daisyui.com/).

## Roadmap

*   [x] Make it work!

*   [x] Make it work without `show` a prop

*   [x] TSDoc

*   [x] Change testing tools to Vitest

*   [x] Improve tests

*   [x] Improve docs( reuse, passing props ...)

*   [x] More examples

## Thanks

Inspired by [`Vueuse`](https://github.com/vueuse/vueuse) and [`vue-modal-dialogs`](https://github.com/hjkcai/vue-modal-dialogs). Thanks to all creators of these projects ❤️!

Keep calm and support 🇺🇦!

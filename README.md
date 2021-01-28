# Terii

Terii is a tiny library to help you manage state across your application. It was originally written by [Andy Bell](https://github.com/hankchizljaw) under another name: [Beedle](https://github.com/hankchizljaw/terii).

I have ported Andy's code to TypeScript. That's all folks.

> Terii (japanese: テリー pron. Terī) is the japanese name of the character [Beedle](https://zelda.gamepedia.com/Beedle) from [The Legend of Zelda series](<https://zelda.gamepedia.com/The_Legend_of_Zelda_(Series)>).

## How it works

Terii creates a pattern where a single source of truth, the '_Application State_' cascades state across your app in a predictable fashion. To modify state, a set flow of `actions` and `mutations` help create a traceable data-flow that makes things a little easier to debug.

Using a [Pub/Sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) which notifies anything that is subscribed to changes, a fully reactive front-end can be achieved with a few kilobytes of vanilla JavaScript.

![A flow diagram that shows an action that calls a mutation, which mutates the state and triggers an update to anything that is listening](https://s3-us-west-2.amazonaws.com/s.cdpn.io/174183/terii-flow-diagram.png)

As the diagram above shows, a simple, predictable flow is created by pushing data into an `action` which subsequently calls one or more `mutations`. Only the `mutation` can modify state, which helps with keeping track of changes.

[**Continue reading the documentation**](https://terii.hankchizljaw.io/guide/state.html)

## A mini library for small projects

Terii is inspired by libraries like Redux, but certainly isn't designed to replace it. Terii is aimed more at tiny little applications or where a development team might be looking to create the smallest possible footprint with their JavaScript.

## Performance budget

Terii is intended to be _tiny_, so the largest that the uncompressed size will ever get to is 5kb.

## Browser support

Terii is aimed at browsers that support ES6 by default. It also uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to monitor state, so [anything that supports Proxy](https://caniuse.com/#feat=proxy) will support Terii.

You could use the [Proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill) to support more browsers.

Most major browsers will support Terii with no issues.

## Getting started

You can pull Terii down via [npm](http://npmjs.com) or take a [zip of this repository](https://github.com/hankchizljaw/terii/archive/master.zip). The rest of this guide assumes you've used npm.

### 1) Install

Run `npm install terii` in your project directory.

### 2) Create a `store` instance

First up, import it into your JavaScript:

```JavaScript
import Store from 'terii';
```

Once you've got that you should create some `actions`, `mutations` and some initial state:

```javascript
const actions = {
  saySomething(context, payload) {
    context.commit('setMessage', payload)
  },
}

const mutations = {
  setMessage(state, payload) {
    state.message = payload

    return state
  },
}

const initialState = {
  message: 'Hello, world',
}
```

Once you've got those setup, you can create a `Store` instance like this:

```javascript
const storeInstance = new Store({
  actions,
  mutations,
  initialState,
})
```

### 3) Use in your app

Let's say you've got a text box that you type a message into. When the content is changed, it could dispatch a new message to your store:

```javascript
// Grab the textarea and dispatch the action on 'input'
const textElement = document.querySelector('textarea')

textElement.addEventListener('input', () => {
  // Dispatch the action, which will subsequently pass this message to the mutation
  // which in turn, updates the store's state
  storeInstance.dispatch('saySomething', textElement.value.trim())
})
```

### 4) Listen for changes

Terii uses the Pub/Sub pattern to transmit changes. Let's attach the message to a DOM element:

```javascript
// Grab the text element and attach it to the stateChange event
const messageElement = document.querySelector('.js-message-element')

// This fires every time the state updates
storeInstance.subscribe((state) => {
  messageElement.innerText = state.message
})
```

Head over to the [basic demo](https://terii-basic-demo.hankchizljaw.io/) to see this in action 🚀

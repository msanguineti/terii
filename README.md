# Terii <!-- omit in toc -->

Terii is a tiny library to help you manage state across your application. It was originally written by [Andy Bell](https://github.com/hankchizljaw) under another name: [Beedle](https://github.com/hankchizljaw/beedle).

I have ported Andy's code to TypeScript (and added [`unsubscribe`](#listen-for-changes-and-stop-listening)). That's all folks.

> Terii (japanese: テリー pron. Terī) is the japanese name of the character [Beedle](https://zelda.gamepedia.com/Beedle) from [The Legend of Zelda series](<https://zelda.gamepedia.com/The_Legend_of_Zelda_(Series)>). It might be better written as Terry, but it was not available on [npm](https://www.npmjs.com/), 😅

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
  - [Install](#install)
  - [Create a `store` instance](#create-a-store-instance)
  - [Use in your app](#use-in-your-app)
  - [Listen for changes (and stop listening)](#listen-for-changes-and-stop-listening)
- [How it works](#how-it-works)
- [A mini library for small projects](#a-mini-library-for-small-projects)
- [Performance budget](#performance-budget)
- [Browser support](#browser-support)
- [TypeScript](#typescript)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Getting started

You can pull Terii down via [npm](http://npmjs.com) or take a [zip of this repository](https://github.com/msanguineti/terii/archive/master.zip). The rest of this guide assumes you've used npm.

### Install

```sh
npm install terii
```

### Create a `store` instance

First up, import it into your JavaScript:

```js
import { Store } from 'terii'
```

Once you've got that you should create some `actions`, `mutations` and some initial state:

```js
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

```js
const storeInstance = new Store({
  actions,
  mutations,
  initialState,
})
```

### Use in your app

Let's say you've got a text box that you type a message into. When the content is changed, it could dispatch a new message to your store:

```js
// Grab the textarea and dispatch the action on 'input'
const textElement = document.querySelector('textarea')

textElement.addEventListener('input', () => {
  // Dispatch the action, which will subsequently pass this message to the mutation
  // which in turn, updates the store's state
  storeInstance.dispatch('saySomething', textElement.value.trim())
})
```

### Listen for changes (and stop listening)

Terii uses the Pub/Sub pattern to transmit changes. Let's attach the message to a DOM element:

```js
// Grab the text element and attach it to the stateChange event
const messageElement = document.querySelector('.js-message-element')

// This fires every time the state updates
storeInstance.subscribe('.js-message-element', (state) => {
  messageElement.innerText = state.message
})
```

If necessary, we can stop listening for changes by unsubscribing:

```js
// we stop listening to what we subscribed earlier
storeInstance.unsubscribe('.js-message-element')
```

## How it works

Terii creates a pattern where a single source of truth, the '_Application State_' cascades state across your app in a predictable fashion. To modify state, a set flow of `actions` and `mutations` help create a traceable data-flow that makes things a little easier to debug.

Using a [Pub/Sub pattern](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) which notifies anything that is subscribed to changes, a fully reactive front-end can be achieved with a few kilobytes of vanilla JavaScript.

## A mini library for small projects

Terii is inspired by libraries like Redux, but certainly isn't designed to replace it. Terii is aimed more at tiny little applications or where a development team might be looking to create the smallest possible footprint with their JavaScript.

## Performance budget

Terii is intended to be _tiny_, so the largest that the uncompressed size will ever get to is 5kb.

## Browser support

Terii is aimed at browsers that support ES6 by default. It also uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to monitor state, so [anything that supports Proxy](https://caniuse.com/#feat=proxy) will support Terii.

You could use the [Proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill) to support more browsers.

Most major browsers will support Terii with no issues.

## TypeScript

TypeScript types are included.

## Contributing

If you are intereseted in contributing to this project, please refer to the [documentation](Contributing.md).

## Changelog

Check the [releases page](https://github.com/msanguineti/terii/releases) for the latest changes.

## License

Original work Copyright (c) 2018 Andy Bell - MIT License
Modified work Copyright (c) 2021 Mirco Sanguineti - See [License](LICENSE)

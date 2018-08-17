# Redux Fiber

A side effects library for building highly resilient, self-healing, offline first apps.

## How does it work?

UI as a function of State (`ui(state)`) is a simple yet extremely powerful pattern.
Redux Fiber enables Effects as a function of State (`effects(state)`) which, as it turns out, 
is a very effective way to build complex control flows and offline capable apps.

Using Redux Fiber, your app is made up of one or more `fibers` that will start, update and stop themselves based
on state. This means that your app can reboot at any point in time and effects will resume
from where they left off.

## Why another Side Effects library?

Most side-effect libraries use actions to spawn off processes and perform side effects.
This is problematic for apps where state is persisted because side-effects aren't resumed automatically and
state can get persisted in an unfinished/broken state. The fact that these libraries create an environment where your state
can become broken is a good indicator that your `state` doesn't actually represent state at all.

When building offline capable apps, you need to start persisting your state so that it can work offline.
As soon as you start persisting state, you need to embrace the fact that anything can happen at any time.
Your app might be refreshed, it might crash, it might be paused and resumed at any point in time.
These problems can and have been solved by introducing complex resuming mechanisms, but this seems like a 
code smell, indicative of a bigger problem with the way we manage side effects from the start.

I built redux-fiber as a result of my continuing search for the holy-grail of app development.

## Quick Start

Install redux-fiber:

```bash
yarn add --dev redux-fiber
```

Create your fibers:

```js
// messages/sendMessageFiber.js
import { selectUnsentMessages } from './reducer'
import { sendMessageSuccess, sendMessageError } from './actions'
import api from '../api'

export default {
  name: 'sendMessage',
  getProps: selectUnsentMessages,
  getKey: ({ cuid }) => cuid,
  start: (message, dispatch, getState) => {
    let request
    
    create(message)

    function create({ cuid, spaceId, userId, text }) {
      if (request) request.cancel()
      request = api.createMessage(
        { spaceId, userId, text },
        error => dispatch(sendMessageError(error)),
        data => dispatch(sendMessageSuccess(cuid))
      )
    }

    return {
      update: (nextMessage) => {
        if (nextMessage.text !== message.text) {
          message = nextMessage
          create(message)
        }
      },
      stop: () => request.cancel(),
    }
  }
}
```

Attach the middleware to your store

```js
// store.js
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createFibers } from 'redux-fiber'
import { MESSAGES, messagesReducer, sendMessageFiber } from '../messages'

const reducer = combineReducers({
  [MESSAGES]: messagesReducer,
})
const fibers = createFibers(sendMessageFiber)
const middleware = applyMiddleware(fibers)
const store = createStore(reducer, middleware)
```

## API

### createFibers (Function)

*Arguments:*

1. `...fibers` (Object): One or more `FiberConfig` objects to be combined into middleware

*Returns:*

(Function): The redux middleware to be passed into your store using applyMiddleware

### FiberConfig (Object)

*Options:*

1. [`name`] (String): An optional name for this fiber, used for debugging.
1. [`selectors`] (Array): An array of selectors that will be resolved with state and passed into `getProps`
2. `getProps` (Function): A function that will be called with the selectors as params.
If no selectors are provided it will be called with state (eg you could use a single selector here).
The return value of this function is used to start, update and stop a fiber.
If the return value is an array, a fiber will be started/updated for each item.
If the return value is an object, a single fiber will be started/updated with this value.
If the return value is `null`, `undefined` or an empty array, any active fibers will be stopped.
If the return value excludes previous values that started a fiber, they will be stopped.
3. [`getKey`] (Function): A function that is called with each set of props.
The return value is used as a key to determine which set of props belongs to which fiber.
If no getKey function is defined, all prop changes will target a single fiber.
4. `start` (Function): A function that is called to start a fiber. 
The function is passed props, dispatch and getState as params for the fiber to process.
This function can return a `FiberControls` object if it needs to react to update/stop

### FiberControls (Object)

*Options:*

1. [`update`] (Function): Called when props change for this fiber.
1. [`stop`] (Function): Called when the fiber has been stopped.
import { isArray, isFunction, throttle } from 'lodash'

import { invariant, logStatus } from './utils'

const getSingletonKey = () => 'fiber/SINGLETON'
const noop = () => {}

export function createFibers(...values) {
  return store => {
    const types = []
    values.forEach(value => {
      if (isArray(value)) {
        value.forEach(type => types.push(type))
      } else {
        types.push(value)
      }
    })

    // initialize + validate
    types.forEach(type => {
      type.name = type.name || 'unnamedFiber'
      type.getKey = type.getKey || getSingletonKey
      type.fibers = []
      if (type.selectors && !type.selectors.length) {
        type.selectors = null
      }
      invariant(
        isFunction(type.getProps),
        `getProps function is required (${type.name})`
      )
      invariant(
        isFunction(type.start),
        `start function is required (${type.name})`
      )
    })

    function didPropsChange(props, nextProps) {
      for (let key in props) if (!(key in nextProps)) return true
      for (let key in nextProps) if (props[key] !== nextProps[key]) return true
      return false
    }

    // returns [{ key, props }] used to start/update/stop instances
    function getChanges(type, state) {
      let results
      if (type.selectors) {
        let selected = type.selectors.map(selector => selector(state))
        results = type.getProps(...selected)
      } else {
        results = type.getProps(state)
      }
      if (!results) return []
      if (!isArray(results)) results = [results]
      return results.map(props => ({
        key: type.getKey(props),
        props,
      }))
    }

    function update(type, state) {
      let changes = getChanges(type, state)

      // kill any fibers that have no changes
      type.fibers = type.fibers.filter(fiber => {
        let match = changes.find(change => fiber.key === change.key)
        if (match) return true
        fiber.stop()
        logStatus(type, fiber, 'stopped')
        return false
      })

      // start or update instances from changes
      changes.forEach(({ key, props }) => {
        let fiber = type.fibers.find(fiber => fiber.key === key)
        if (fiber) {
          if (didPropsChange(fiber.props, props)) {
            fiber.stop()
            fiber.stop = fiber.update(props) || noop
            fiber.props = props
          }
        } else {
          let updater = type.start(store)
          let fiber = {
            key,
            props,
            update,
          }
          let update = props => {
            fiber.stop = updater(props) || noop
            logStatus(type, fiber, 'updated', props)
          }
          if (type.throttle) {
            fiber.update = throttle(update, type.throttle)
          } else {
            fiber.update = update
          }
          fiber.update(props)
          type.fibers.push(fiber)
          logStatus(type, fiber, 'started')
        }
      })
    }

    // TODO: why does middleware ignore the internal init action :/
    setTimeout(function() {
      store.dispatch({ type: 'fiber/INIT' })
    })

    return next => action => {
      let result = next(action)
      const state = store.getState()
      types.forEach(type => update(type, state))
      return result
    }
  }
}

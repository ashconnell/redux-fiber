import { isArray, isFunction } from 'lodash'
import { invariant, log } from './utils'

const UN_KEYED_FIBER = 'fiber/UN_KEYED'

const defaultGetKey = () => UN_KEYED_FIBER

export function createFibers(...types) {
  return ({ dispatch, getState }) => {
    let ids = 0

    // initialize + validate
    types.forEach(type => {
      type.name = type.name || 'NO_NAME_FIBER'
      type.getKey = type.getKey || defaultGetKey
      type.fibers = []
      // invariant(
      //   isFunction(type.getProps),
      //   `getProps function is required (${type.name})`
      // )
      if (type.selectors) {
        invariant(
          type.selectors.length,
          `selectors specified with no selectors (${type.name})`
        )
      }
      invariant(
        isFunction(type.start),
        `start function is required (${type.name})`
      )
      log(`${type.name} registered`)
    })

    // returns [{ key, props }] used to start/update/stop instances
    function getChanges(type, state) {
      let results
      if (type.selectors) {
        let selected = type.selectors.map(selector => selector(state))
        results = type.getProps ? type.getProps(...selected) : selected
      } else {
        results = type.getProps(state)
      }
      if (!results) {
        return []
      }
      if (!isArray(results)) {
        results = [results]
      }
      let changes = results.map(props => ({
        key: type.getKey(props),
        props,
      }))
      return changes
    }

    function update(type, state) {
      let changes = getChanges(type, state)

      // kill any fibers that have no changes
      type.fibers = type.fibers.filter(fiber => {
        let match = changes.find(change => fiber.key === change.key)
        if (match) {
          return true
        }
        fiber.stop && fiber.stop()
        log(`${type.name}:${fiber.id} stopped`)
        return false
      })

      // start or update instances from changes
      changes.forEach(({ key, props }) => {
        let fiber = type.fibers.find(fiber => fiber.key === key)
        if (fiber) {
          if (fiber.update) {
            fiber.update(props)
            log(`${type.name}:${fiber.id} updated`, props)
          }
        } else {
          let id = ++ids
          let control = type.start(props, dispatch, getState)
          if (isFunction(control)) {
            control = { stop: control }
          }
          type.fibers.push({
            id,
            key,
            ...control,
          })
          log(`${type.name}:${id} started`, props)
        }
      })
    }

    // TODO: why does middleware ignore the internal init action :/
    setTimeout(function() {
      dispatch({ type: 'INIT' })
    })

    return next => action => {
      let result = next(action)
      const state = getState()
      types.forEach(type => update(type, state))
      return result
    }
  }
}

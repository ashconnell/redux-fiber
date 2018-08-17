import { isArray, isFunction } from 'lodash'
import { invariant, log } from './utils'

const SINGLE_INSTANCE = 'fiber/SINGLE'

export function createFibers(...fibers) {
  return ({ dispatch, getState }) => {
    let ids = 0

    // initialize + validate
    fibers.forEach(fiber => {
      fiber.name = fiber.name || 'UNNAMED_FIBER'
      fiber.active = []
      invariant(
        isFunction(fiber.getProps),
        `getProps function is required (${fiber.name})`
      )
      invariant(
        isFunction(fiber.getKey),
        `getKey function is required (${fiber.name})`
      )
      invariant(
        isFunction(fiber.start),
        `start function is required (${fiber.name})`
      )
      log(`${fiber.name} registered`)
    })

    // returns [{ key, props }] used to start/update/stop instances
    function getChanges(fiber, state) {
      let sets
      if (isArray(fiber.selectors) && fiber.selectors.length) {
        let values = fiber.selectors.map(selector => selector(state))
        let result = fiber.getProps(...values)
        if (!result) return []
        sets = isArray(result) ? result : [result]
      } else {
        let result = fiber.getProps(state)
        if (!result) return []
        sets = isArray(result) ? result : [result]
      }
      let changes = sets.map(props => ({
        key: fiber.getKey(props) || SINGLE_INSTANCE,
        props,
      }))
      return changes
    }

    function updateInstances(fiber, state) {
      let changes = getChanges(fiber, state)

      // kill any instances that have no changes
      fiber.active = fiber.active.filter(instance => {
        let match = changes.find(change => instance.key === change.key)
        if (match) {
          return true
        }
        fiber.stop && fiber.stop()
        log(`${fiber.name}:${instance.id} stopped`)
        return false
      })

      // start or update instances from changes
      changes.forEach(({ key, props }) => {
        let instance = fiber.active.find(instance => instance.key === key)
        if (instance) {
          if (instance.update) {
            instance.update(props)
            log(`${fiber.name}:${instance.id} updated`, props)
          }
        } else {
          let id = ++ids
          fiber.active.push({
            id,
            key,
            ...fiber.start(props, dispatch, getState),
          })
          log(`${fiber.name}:${id} started`, props)
        }
      })
    }

    // update on state change
    function onStateChange() {
      const state = getState()
      fibers.forEach(fiber => updateInstances(fiber, state))
    }

    return next => action => {
      let result = next(action)
      onStateChange()
      return result
    }
  }
}

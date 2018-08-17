import { isProd } from './config'

export const invariant = (valid, message) => {
  if (valid === false && !isProd) {
    throw new Error(`[redux-fiber] ${message}`)
  }
}

export const log = (...args) => {
  if (isProd) return
  console.log('[redux-fiber]', ...args)
}

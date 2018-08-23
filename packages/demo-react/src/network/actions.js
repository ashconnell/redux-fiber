export const NETWORK_STATUS_CHANGED = 'network/STATUS_CHANGED'

export const networkStatusChanged = isOnline => ({
  type: NETWORK_STATUS_CHANGED,
  isOnline,
})

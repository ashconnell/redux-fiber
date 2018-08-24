import { padStart } from 'lodash'
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

export const formatTime = time =>
  `${padStart(time.getHours(), 2, 0)}:${padStart(
    time.getMinutes(),
    2,
    0
  )}:${padStart(time.getSeconds(), 2, 0)}.${padStart(
    time.getMilliseconds(),
    3,
    0
  )}`

export const logStatus = (type, fiber, status, nextProps) => {
  let statusColor
  switch (status) {
    case 'started':
      statusColor = '#62CE4F'
      break
    case 'updated':
      statusColor = '#E29248'
      break
    case 'stopped':
      statusColor = '#E24848'
      break
  }
  console.group(
    `%c● %cfiber %c${type.name} %c${status} @ ${formatTime(new Date())}`,
    `color:${statusColor}`,
    'color:#7D7D7D; font-weight: 100',
    'color:#BFC6CE',
    'color:#7D7D7D; font-weight: 100'
  )
  console.log(
    ` %ckey	        %c${fiber.key}`,
    'color:#9E9E9E; font-weight: bold',
    'color:#7D7D7D; font-weight: 100'
  )
  if (nextProps) {
    console.log(
      ' %cprev props ',
      'color:#9E9E9E; font-weight: bold',
      fiber.props
    ),
      console.log(
        ' %cnext props ',
        'color:#66AA5A; font-weight: bold',
        nextProps
      )
  } else {
    console.log(
      ' %cprops      ',
      'color:#66AA5A; font-weight: bold',
      fiber.props
    )
  }
  console.groupEnd()
}

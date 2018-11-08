import _ from 'lodash'
import jwtDecode from 'jwt-decode'

const OPTIONS_KEYS = [
  'stelaceVersion',
  'stelaceUserId'
]

const hasOwn = {}.hasOwnProperty

export const isApiKey = (key) => {
  if (typeof key !== 'string' || key.length !== 32) return false

  const parts = key.split('_')
  if (parts.length !== 3) return false

  const type = parts[0]
  return type.length === 2
}

export const isSecretApiKey = (key) => {
  return isApiKey(key) && key.startsWith('sk_')
}

export const asCallback = (promise, cb) => {
  if (typeof cb !== 'function') return promise

  const p = promise
    .then(res => cb(null, res))
    .catch(err => setTimeout(() => cb(err), 0)) // async throw

  return p
}

export const isPromise = (obj) => {
  return !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function' &&
    typeof obj.catch === 'function'
}

export const interpolatePath = (path, data) => {
  let newPath = path
  const keys = Object.keys(data)

  keys.forEach(key => {
    newPath = newPath.replace(':' + key, data[key])
  })

  return newPath
}

export const isOptionsHash = (obj) => {
  return _.isObject(obj) && OPTIONS_KEYS.some(key => hasOwn.call(obj, key))
}

export const getDataFromArgs = (args) => {
  if (!args.length || !_.isObject(args[0])) {
    return {}
  }

  if (!isOptionsHash(args[0])) {
    return args.shift()
  }

  const argKeys = Object.keys(args[0])

  const optionKeysInArgs = argKeys.filter(key => {
    return OPTIONS_KEYS.indexOf(key) > -1
  })

  // In some cases options may be the provided as the first argument.
  // Here we're detecting a case where there are two distinct arguments
  // (the first being args and the second options) and with known
  // option keys in the first so that we can warn the user about it.
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning(
      `Options found in arguments (${optionKeysInArgs.join(', ')}). Did you mean to pass an options object? `
    )
  }

  return {}
}

export const getOptionsFromArgs = (args) => {
  const opts = {
    headers: {}
  }
  if (args.length > 0) {
    const arg = _.last(args)
    if (isOptionsHash(arg)) {
      const params = args.pop()

      const extraKeys = Object.keys(params).filter(key => {
        return OPTIONS_KEYS.indexOf(key) === -1
      })

      if (extraKeys.length) {
        emitWarning(`Invalid options found (${extraKeys.join(', ')}); ignoring.`)
      }

      if (params.stelaceVersion) {
        opts.headers['x-stelace-version'] = params.stelaceVersion
      }
      if (params.stelaceUserId) {
        opts.headers['x-stelace-user-id'] = params.stelaceUserId
      }
    }
  }

  return opts
}

export const addReadOnlyProperty = (obj, propertyName, property) => {
  Object.defineProperty(obj, propertyName, {
    enumerable: false,
    writable: false,
    value: property
  })
}

export const decodeJwtToken = (jwtToken) => {
  return jwtDecode(jwtToken)
}

function emitWarning (warning) {
  if (process) {
    if (typeof process.emitWarning !== 'function') {
      return console.warn('Stelace: ' + warning)
    }

    return process.emitWarning(warning, 'Stelace')
  }
}

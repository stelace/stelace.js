import jwtDecode from 'jwt-decode'

const OPTIONS_KEYS = [
  'stelaceVersion',
  'stelaceUserId',
  'stelaceOrganizationId'
]

export const maxNbResultsPerPage = 100

const hasOwn = {}.hasOwnProperty

export const isApiKey = (key) => {
  if (typeof key !== 'string' || key.length < 32) return false

  const parts = key.split('_')
  if (parts.length !== 3) return false

  const type = parts[0]
  return type.length >= 2 && type.length <= 10
}

export const isSecretApiKey = (key) => {
  return isApiKey(key) && key.startsWith('seck_')
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
  return isObject(obj) && OPTIONS_KEYS.some(key => hasOwn.call(obj, key))
}

export const getDataFromArgs = (args) => {
  if (!args.length || !isObject(args[0])) return {}

  // Object should be either API data/params
  if (!isOptionsHash(args[0])) return args.shift()

  // …or SDK options
  // since some endpoints options object may be the provided as the first argument
  // when there optional first argument is not be passed
  const argKeys = Object.keys(args[0])
  const optionKeysInArgs = argKeys.filter(key => {
    return OPTIONS_KEYS.indexOf(key) > -1
  })

  // Detect erroneous options passed in data object
  // i.e. object having some keys that are not options
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning(
      `Options found in arguments (${
        optionKeysInArgs.join(', ')
      }). Did you mean to pass an options object? `
    )
  }

  return {}
}

export const getOptionsFromArgs = (args) => {
  const opts = {
    headers: {}
  }
  if (args.length > 0) {
    const arg = last(args)
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
      if (typeof params.stelaceOrganizationId !== 'undefined') {
        opts.headers['x-stelace-organization-id'] = params.stelaceOrganizationId
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

export const isBrowser = () => {
  return typeof window === 'object'
}

export const encodeBase64 = (value) => {
  if (isBrowser()) return window.btoa(value)
  else return Buffer.from(value).toString('base64')
}

export const decodeBase64 = (value) => {
  if (isBrowser()) return window.atob(value)
  else return Buffer.from(value, 'base64').toString('ascii')
}

// Lodash-like helpers

export function isObject (obj) { // similar to lodash isObjectLike
  return obj && typeof obj === 'object'
}

export function last (arr) {
  return isObject(arr) && arr.length ? arr[arr.length - 1] : undefined
}
/**
 * Creates an object composed of the object properties predicate returns truthy for.
 * The predicate is invoked with two arguments: (value, key).
 * @param {Object} object
 * @param {Function} [predicate = identity] - Only keeping truthy values by default
 */
export function pickBy (object, predicate = _ => _) {
  const obj = {}
  for (const key in object) {
    if (predicate(object[key], key)) obj[key] = object[key]
  }
  return obj
}

export function clone (data) {
  if (!isObject(data)) return data
  return Array.isArray(data) ? [].slice.call(data) : Object.assign({}, data)
}

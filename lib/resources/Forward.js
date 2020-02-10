import Resource from '../Resource'
import { asCallback } from '../utils'
import makeRequest from '../makeRequest'

function forwardMethod (method) {
  return function (path, ...args) {
    const callback = typeof args[args.length - 1] === 'function' && args.pop()

    const spec = { method, path }
    const requestPromise = asCallback(makeRequest(this, args, spec), callback)

    return requestPromise
  }
}

export default class Forward extends Resource {}

Forward.prototype.get = forwardMethod('GET')
Forward.prototype.post = forwardMethod('POST')
Forward.prototype.put = forwardMethod('PUT')
Forward.prototype.patch = forwardMethod('PATCH')
Forward.prototype.del = forwardMethod('DELETE')
Forward.prototype.options = forwardMethod('OPTIONS')

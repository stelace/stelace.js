import { asCallback } from './utils'
import makeRequest from './makeRequest'
import makeAutoPaginationMethods from './autoPagination'

/**
 * Create an API method from the spec
 * @param {Object} spec
 * @param {String} [spec.method='GET'] - request method ('GET', 'POST', 'PATCH', 'DELETE')
 * @param {String} spec.path - path with tokens to replace like '/categories/:id'
 * @param {Boolean} [spec.isList=false] - if true, transforms the response to include
 *     the object `paginationMeta` if any pagination properties are present
 *  with properties (nbResults, nbPages, page, nbResultsPerPage)
 * @param {String[]} [spec.urlParams=[]] - list of url parameters that must be provided (usually ['id'])
 * @param {Function} [spec.transformResponseData]
 */
export default function method (spec) {
  return function (...args) {
    const callback = typeof args[args.length - 1] === 'function' && args.pop()

    const requestPromise = asCallback(makeRequest(this, args, spec), callback)

    if (spec.isList) {
      const autoPaginationMethods = makeAutoPaginationMethods(
        this,
        args,
        spec,
        requestPromise
      )
      Object.assign(requestPromise, autoPaginationMethods)
    }

    return requestPromise
  }
}

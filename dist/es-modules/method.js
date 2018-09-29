import { asCallback } from './utils';
import makeRequest from './makeRequest';

/**
 * Create an API method from the spec
 * @param {Object} spec
 * @param {String} [spec.method='GET'] - request method ('GET', 'POST', 'PATCH', 'DELETE')
 * @param {String} spec.path - path with tokens to replace like '/categories/:id'
 * @param {Boolean} [spec.paginationMeta=false] - if true, transforms the response to include the object `paginationMeta`
 *  with properties (nbResults, nbPages, page, nbResultsPerPage)
 * @param {String[]} [spec.urlParams=[]] - list of url parameters that must be provided (usually ['id'])
 * @param {Function} [spec.transformResponseData]
 */
export default function method(spec) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var callback = typeof args[args.length - 1] === 'function' && args.pop();

    var requestPromise = asCallback(makeRequest(this, args, spec), callback);

    return requestPromise;
  };
}
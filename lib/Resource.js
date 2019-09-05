import axios from 'axios'
import method from './method'
import getBasicMethods from './method.basic'
import {
  addReadOnlyProperty,
  clone,
  isBrowser,
  pickBy,
  encodeBase64
} from './utils'

export default class Resource {
  constructor (stelace) {
    this._stelace = stelace
  }

  _request ({ path, method, data, queryParams, options = {} }) {
    const requestParams = {
      url: path,
      method,
      baseURL: this.getBaseURL(),
      headers: this._prepareHeaders(options),
      timeout: this._stelace.getApiField('timeout')
    }

    if (queryParams && Object.keys(queryParams).length) {
      requestParams.params = queryParams
    }
    if (data && Object.keys(data).length) {
      requestParams.data = data
    }

    return axios(requestParams)
      .then(this._responseHandler)
      .catch(this._errorHandler)
  }

  _responseHandler (res) {
    const response = clone(res.data)

    const lastResponse = {
      requestId: res.headers['x-request-id'],
      statusCode: res.status
    }

    addReadOnlyProperty(response, 'lastResponse', lastResponse)

    return response
  }

  _errorHandler (err) {
    if (!err.response) throw err

    const rawResponse = Object.assign({}, err.response)
    const error = Object.assign({}, rawResponse.data) // useful for tests (cannot add multiple times `lastResponse`)

    const lastResponse = {
      requestId: rawResponse.headers['x-request-id'],
      statusCode: rawResponse.status
    }

    addReadOnlyProperty(error, 'lastResponse', lastResponse)

    throw error
  }

  _prepareHeaders (options) {
    const apiKey = this._stelace.getApiField('key')
    let headers = {}

    // Migrating to 'Authorization: Basic|Bearer|Stelace-V1' header
    const authorization = options.headers && options.headers['authorization'] // can only be Bearer token
    let token = authorization && /Bearer\s+([^\s]*)/i.exec(authorization)
    token = token && token[1]
    // Transforming to custom Authorization scheme
    // https://tools.ietf.org/html/draft-ietf-httpbis-p7-auth-19#appendix-B
    // Note that Stelace API header content parsing is case-insensitive
    // But we use casing for clarity here, as in 'apiKey'
    if (token) headers['authorization'] = `Stelace-V1 apiKey=${apiKey}, token=${token}`
    else if (apiKey) headers['authorization'] = `Basic ${encodeBase64(apiKey + ':')}`

    // cannot set the user agent in browser environment for security reasons
    // https://github.com/axios/axios/issues/1231
    if (!isBrowser()) headers['user-agent'] = this._stelace.getUserAgent()

    const apiVersion = this._stelace.getApiField('version')
    if (apiVersion) headers['x-stelace-version'] = apiVersion

    const organizationId = this._stelace.getApiField('organizationId')
    if (organizationId) headers['x-stelace-organization-id'] = organizationId

    if (options.headers) {
      Object.assign(headers, pickBy(options.headers, (v, k) => k.toLowerCase() !== 'authorization'))
    }

    return pickBy(headers)
  }

  getBaseURL () {
    const protocol = this._stelace.getApiField('protocol')
    const host = this._stelace.getApiField('host')
    const port = this._stelace.getApiField('port')

    return protocol +
      '://' +
      host +
      ([80, 443].includes(port) ? '' : `:${port}`)
  }

  static addBasicMethods (resource, { path, includeBasic = [] }) {
    const basicMethods = getBasicMethods(path, method)

    includeBasic.forEach(name => {
      resource.prototype[name] = basicMethods[name]
    })
  }
}

Resource.method = method

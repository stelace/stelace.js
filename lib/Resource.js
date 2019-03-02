import axios from 'axios'
import _ from 'lodash'
import method from './method'
import getBasicMethods from './method.basic'
import { addReadOnlyProperty, isBrowser } from './utils'

export default class Resource {
  constructor (stelace) {
    this._stelace = stelace
  }

  _request ({ path, method, data, queryParams, options = {} }) {
    let headers = {
      'x-api-key': this._stelace.getApiField('key')
    }

    // cannot set the user agent in browser environment
    // https://github.com/axios/axios/issues/1231
    if (!isBrowser()) {
      headers['user-agent'] = this._stelace.getUserAgent()
    }

    const apiVersion = this._stelace.getApiField('version')
    if (apiVersion) {
      headers['x-stelace-version'] = apiVersion
    }

    const organizationId = this._stelace.getApiField('organizationId')
    if (organizationId) {
      headers['x-stelace-organization-id'] = organizationId
    }

    if (options.headers) {
      Object.assign(headers, options.headers)
    }

    headers = _.pickBy(headers, key => typeof key !== 'undefined' && key !== null)

    const requestParams = {
      url: path,
      method,
      baseURL: this.getBaseURL(),
      headers,
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
    const response = _.clone(res.data)

    const lastResponse = {
      requestId: res.headers['x-request-id'],
      statusCode: res.status
    }

    addReadOnlyProperty(response, 'lastResponse', lastResponse)

    return response
  }

  _errorHandler (err) {
    if (!err.response) throw err

    const rawResponse = _.clone(err.response)

    // copy all error properties into an Error object
    const errorKeys = Object.keys(rawResponse.data)

    const error = new Error(rawResponse.data.message)
    errorKeys.forEach(key => {
      if (key !== 'message') {
        error[key] = rawResponse.data[key]
      }
    })

    const lastResponse = {
      requestId: rawResponse.headers['x-request-id'],
      statusCode: rawResponse.status
    }

    addReadOnlyProperty(error, 'lastResponse', lastResponse)

    throw error
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

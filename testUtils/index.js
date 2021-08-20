import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { capitalize } from 'lodash'
import jwt from 'jsonwebtoken'

import { createInstance } from '../lib/stelace'

export { maxNbResultsPerPage } from '../lib/utils'

export function getApiKey ({ type = 'seck' } = {}) {
  const secretKey = 'seck_test_wakWA41rBTUXs1Y5oNRjeY5o'
  const publishableKey = 'pubk_test_wakWA41rBTUXs1Y5oNRjeY5o'

  switch (type) {
    case 'seck':
      return secretKey
    case 'pubk':
      return publishableKey
    default:
      return secretKey
  }
}

export function getSpyableStelace ({ keyType } = {}) {
  const key = getApiKey({ type: keyType })

  const stelace = createInstance({ apiKey: key })

  cleanStelace(stelace)

  stelace.REQUESTS = []

  for (const i in stelace) {
    makeInstanceSpyable(stelace, stelace[i])
  }

  function makeInstanceSpyable (stelace, thisInstance) {
    patchRequest(stelace, thisInstance)
  }

  function patchRequest (stelace, instance) {
    instance._request = function ({ path, method, data, queryParams, options = {} }) {
      stelace.LAST_REQUEST = {
        path,
        method,
        data,
        queryParams,
        headers: options.headers || {}
      }

      stelace.REQUESTS.push(stelace.LAST_REQUEST)

      return Promise.resolve({})
    }
  }

  return stelace
}

export function getStelaceStub ({ keyType, noKey } = {}) {
  const key = getApiKey({ type: keyType })

  const stelace = noKey ? createInstance({}) : createInstance({ apiKey: key })

  stelace._lastRequest = {}

  stelace.getLastRequest = () => stelace._lastRequest

  stelace.startStub = () => {
    const mock = new MockAdapter(axios)
    stelace._mock = mock
  }

  stelace.stopStub = () => {
    if (!stelace._mock) return
    stelace._mock.restore()
  }

  stelace.stubRequest = (url, { method, data, status, headers, response }) => {
    if (!stelace._mock) return

    const getMockingFnKey = `on${capitalize(method)}`
    stelace._mock[getMockingFnKey](url, data).reply(status, response, headers)
  }

  // to be able to get the last sent request config
  axios.interceptors.request.use(
    config => {
      stelace._lastRequest = { config }
      return config
    },
    Promise.reject
  )

  cleanStelace(stelace)

  return stelace
}

export function encodeJwtToken (data, { secret = 'secret', expiresIn }) {
  const token = jwt.sign(data, secret, { expiresIn })
  return token
}

function cleanStelace (stelace) {
  const tokenStore = stelace.getApiField('tokenStore')
  if (tokenStore) {
    tokenStore.removeTokens()
  }
}

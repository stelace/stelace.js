import { createInstance } from '../lib/stelace'

export function getApiKey () {
  return 'sk_test_wakWA41rBTUXs1Y5oNRjeY5o'
}

export function getSpyableStelace () {
  const key = getApiKey()

  const stelace = createInstance({ apiKey: key })

  stelace.REQUESTS = []

  for (var i in stelace) {
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

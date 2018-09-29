import {
  interpolatePath,
  getDataFromArgs,
  getOptionsFromArgs,
  addReadOnlyProperty
} from './utils'

function getRequestOpts (requestArgs, spec) {
  const {
    path,
    method = 'GET',
    urlParams = []
  } = spec

  // Don't mutate args externally.
  const args = [].slice.call(requestArgs)

  const requestMethod = method.toUpperCase()

  const urlData = {}

  // Check that all specified url params have been provided
  urlParams.forEach(urlParam => {
    const arg = args[0]
    if (typeof arg !== 'string') {
      throw new Error(
        `Stelace: "${urlParam}" must be a string, but got: ${typeof arg}` +
        ` (on API request to ${requestMethod} ${path})`
      )
    }

    urlData[urlParam] = args.shift()
  })

  let requestPath = path
  if (urlParams.length) {
    requestPath = interpolatePath(path, urlData)
  }

  // Pull request data/queryParams and options (headers) from args.
  let data = {}
  let queryParams = {}

  if (method === 'GET') {
    queryParams = getDataFromArgs(args)
  } else {
    data = getDataFromArgs(args)
  }

  const options = getOptionsFromArgs(args)

  // Validate that there are no more args.
  if (args.length) {
    throw new Error(
      `Stelace: Unknown arguments (${args}). Did you mean to pass an options object?` +
      ` (on API request to ${requestMethod} ${path})`
    )
  }

  const headers = Object.assign(options.headers, spec.headers)

  return {
    requestMethod,
    requestPath,
    queryParams,
    data,
    headers
  }
}

function createPaginationMeta (res) {
  const paginationMeta = {
    nbResults: res.nbResults,
    nbPages: res.nbPages,
    page: res.page,
    nbResultsPerPage: res.nbResultsPerPage
  }

  const newResponse = res.results || [] // add empty array for tests

  const lastResponse = res.lastResponse

  // copy the last response from the previous object (is lost otherwise)
  addReadOnlyProperty(newResponse, 'lastResponse', lastResponse)
  addReadOnlyProperty(newResponse, 'paginationMeta', paginationMeta)

  return newResponse
}

export default function makeRequest (self, requestArgs, spec) {
  return Promise.resolve()
    .then(() => {
      const opts = getRequestOpts(requestArgs, spec)

      let requestParams = {
        path: opts.requestPath,
        method: opts.requestMethod,
        data: opts.data,
        queryParams: opts.queryParams,
        options: { headers: opts.headers }
      }

      return self._request(requestParams)
        .then((res) => {
          if (spec.paginationMeta) {
            res = createPaginationMeta(res)
          }

          const response = spec.transformResponseData ? spec.transformResponseData(res) : res
          return response
        })
    })
}

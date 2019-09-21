import Resource from '../Resource'
import { addReadOnlyProperty } from '../utils'

const method = Resource.method

export default class Search extends Resource {}

Search.prototype.results = method({
  path: '/search',
  method: 'POST',
  beforeRequest: (requestParams) => {
    if (requestParams.data && requestParams.data.save) {
      requestParams.data.save = false
    }
    return requestParams
  },
  transformResponseData: (res) => {
    const lastResponse = res.lastResponse

    const paginationMeta = {
      nbResults: res.nbResults,
      nbPages: res.nbPages,
      page: res.page,
      nbResultsPerPage: res.nbResultsPerPage,
      exhaustiveNbResults: res.exhaustiveNbResults
    }

    const newResponse = res.results || [] // add empty array for tests

    addReadOnlyProperty(newResponse, 'lastResponse', lastResponse)
    addReadOnlyProperty(newResponse, 'paginationMeta', paginationMeta)

    return newResponse
  }
})

Search.prototype.list = Search.prototype.results

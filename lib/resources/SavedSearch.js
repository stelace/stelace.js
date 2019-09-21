import Resource from '../Resource'

const method = Resource.method

export default class SavedSearch extends Resource {}

Resource.addBasicMethods(SavedSearch, {
  path: '/search',
  includeBasic: ['list', 'read', 'update', 'remove']
})

SavedSearch.prototype.create = method({
  path: '/search',
  method: 'POST',
  beforeRequest: (requestParams) => {
    requestParams.data = requestParams.data || {}
    requestParams.data.save = true
    return requestParams
  }
})

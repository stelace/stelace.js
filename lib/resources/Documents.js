import Resource from '../Resource'

const method = Resource.method

export default class Documents extends Resource {}

Resource.addBasicMethods(Documents, {
  path: '/documents',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

Documents.prototype.getStats = method({
  path: '/documents/stats',
  method: 'GET',
  isList: true
})

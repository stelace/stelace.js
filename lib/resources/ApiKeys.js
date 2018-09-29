import Resource from '../Resource'

export default class ApiKeys extends Resource {}

Resource.addBasicMethods(ApiKeys, {
  path: '/api-keys',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

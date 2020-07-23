import Resource from '../Resource'

export default class Categories extends Resource {}

Resource.addBasicMethods(Categories, {
  path: '/categories',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

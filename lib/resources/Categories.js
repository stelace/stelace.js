import Resource from '../Resource'

const method = Resource.method

export default class Categories extends Resource {}

Resource.addBasicMethods(Categories, {
  path: '/categories',
  includeBasic: ['read', 'create', 'update', 'remove']
})

Categories.prototype.list = method({
  path: '/categories',
  method: 'GET'
})

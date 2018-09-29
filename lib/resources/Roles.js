import Resource from '../Resource'

const method = Resource.method

export default class Roles extends Resource {}

Resource.addBasicMethods(Roles, {
  path: '/roles',
  includeBasic: ['read', 'create', 'update', 'remove']
})

Roles.prototype.list = method({
  path: '/roles',
  method: 'GET'
})

import Resource from '../Resource'

const method = Resource.method

export default class Users extends Resource {}

Resource.addBasicMethods(Users, {
  path: '/users',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

Users.prototype.checkAvailability = method({
  path: '/users/check-availability',
  method: 'GET'
})

Users.prototype.updateOrganization = method({
  path: '/users/:id/organizations/:organizationId',
  method: 'PATCH',
  urlParams: ['id', 'organizationId']
})

Users.prototype.removeFromOrganization = method({
  path: '/users/:id/organizations/:organizationId',
  method: 'DELETE',
  urlParams: ['id', 'organizationId']
})

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

Users.prototype.updateOrganizations = method({
  path: '/users/:id/organizations',
  method: 'PATCH',
  urlParams: ['id']
})

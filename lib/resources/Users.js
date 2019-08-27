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

// DEPRECATED: in favor of more explicit name
Users.prototype.updateOrganization = method({
  path: '/users/:id/organizations/:organizationId',
  method: 'PUT',
  urlParams: ['id', 'organizationId']
})
// DEPRECATED:END

Users.prototype.joinOrganizationOrUpdateRights = method({
  path: '/users/:id/organizations/:organizationId',
  method: 'PUT',
  urlParams: ['id', 'organizationId']
})

Users.prototype.removeFromOrganization = method({
  path: '/users/:id/organizations/:organizationId',
  method: 'DELETE',
  urlParams: ['id', 'organizationId']
})

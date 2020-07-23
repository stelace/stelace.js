import Resource from '../Resource'

export default class Roles extends Resource {}

Resource.addBasicMethods(Roles, {
  path: '/roles',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

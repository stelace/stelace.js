import Resource from '../Resource'

export default class Workflows extends Resource {}

Resource.addBasicMethods(Workflows, {
  path: '/workflows',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

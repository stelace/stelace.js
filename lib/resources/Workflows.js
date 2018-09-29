import Resource from '../Resource'

const method = Resource.method

export default class Workflows extends Resource {}

Resource.addBasicMethods(Workflows, {
  path: '/workflows',
  includeBasic: ['read', 'create', 'update', 'remove']
})

Workflows.prototype.list = method({
  path: '/workflows',
  method: 'GET'
})

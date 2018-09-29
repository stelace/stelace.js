import Resource from '../Resource'

const method = Resource.method

export default class Webhooks extends Resource {}

Resource.addBasicMethods(Webhooks, {
  path: '/webhooks',
  includeBasic: ['read', 'create', 'update', 'remove']
})

Webhooks.prototype.list = method({
  path: '/webhooks',
  method: 'GET'
})

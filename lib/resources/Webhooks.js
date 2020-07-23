import Resource from '../Resource'

export default class Webhooks extends Resource {}

Resource.addBasicMethods(Webhooks, {
  path: '/webhooks',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

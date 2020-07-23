import Resource from '../Resource'

const method = Resource.method

export default class Events extends Resource {}

Resource.addBasicMethods(Events, {
  path: '/events',
  includeBasic: ['list', 'read', 'create']
})

Events.prototype.getStats = method({
  path: '/events/stats',
  method: 'GET',
  isList: true
})

import Resource from '../Resource'

const method = Resource.method

export default class Availabilities extends Resource {}

Resource.addBasicMethods(Availabilities, {
  path: '/availabilities',
  includeBasic: ['list', 'create', 'update', 'remove']
})

Availabilities.prototype.getGraph = method({
  path: '/availabilities/graph',
  method: 'GET'
})

import Resource from '../Resource'

const method = Resource.method

export default class Ratings extends Resource {}

Resource.addBasicMethods(Ratings, {
  path: '/ratings',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

Ratings.prototype.getStats = method({
  path: '/ratings/stats',
  method: 'GET',
  isList: true
})

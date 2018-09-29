import Resource from '../Resource'

const method = Resource.method

export default class Availabilities extends Resource {}

Availabilities.prototype.list = method({
  path: '/assets/:assetId/availabilities',
  method: 'GET',
  urlParams: ['assetId'],
  paginationMeta: true
})

Availabilities.prototype.create = method({
  path: '/assets/:assetId/availabilities',
  method: 'POST',
  urlParams: ['assetId']
})

Availabilities.prototype.update = method({
  path: '/assets/:assetId/availabilities/:availabilityId',
  method: 'PATCH',
  urlParams: ['assetId', 'availabilityId']
})

Availabilities.prototype.remove = method({
  path: '/assets/:assetId/availabilities/:availabilityId',
  method: 'DELETE',
  urlParams: ['assetId', 'availabilityId']
})

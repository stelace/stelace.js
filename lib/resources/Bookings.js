import Resource from '../Resource'

const method = Resource.method

export default class Bookings extends Resource {}

Resource.addBasicMethods(Bookings, {
  path: '/bookings',
  includeBasic: ['list', 'read', 'create', 'update']
})

Bookings.prototype.accept = method({
  path: '/bookings/:id/acceptation',
  method: 'POST',
  urlParams: ['id']
})

Bookings.prototype.cancel = method({
  path: '/bookings/:id/cancellation',
  method: 'POST',
  urlParams: ['id']
})

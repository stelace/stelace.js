import Resource from '../Resource'

const method = Resource.method

export default class Bookings extends Resource {}

Resource.addBasicMethods(Bookings, {
  path: '/bookings',
  includeBasic: ['list', 'read', 'create', 'update']
})

Bookings.prototype.pay = method({
  path: '/bookings/:id/payments',
  method: 'POST',
  urlParams: ['id']
})

Bookings.prototype.confirm = method({
  path: '/bookings/:id/confirmation',
  method: 'POST',
  urlParams: ['id']
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

Bookings.prototype.process = method({
  path: '/bookings/:id/process',
  method: 'POST',
  urlParams: ['id']
})

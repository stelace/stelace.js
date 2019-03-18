import Resource from '../Resource'

const method = Resource.method

export default class Bookings extends Resource {}

Resource.addBasicMethods(Bookings, {
  path: '/bookings',
  includeBasic: ['list', 'read', 'create', 'update']
})

Bookings.prototype.createTransition = method({
  path: '/bookings/:id/transitions',
  method: 'POST',
  urlParams: ['id']
})

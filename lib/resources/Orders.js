import Resource from '../Resource'

const method = Resource.method

export default class Orders extends Resource {}

Resource.addBasicMethods(Orders, {
  path: '/orders',
  includeBasic: ['list', 'read', 'create', 'update']
})

Orders.prototype.preview = method({
  path: '/orders/preview',
  method: 'POST'
})

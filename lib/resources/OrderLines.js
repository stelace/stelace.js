import Resource from '../Resource'

export default class OrderLines extends Resource {}

Resource.addBasicMethods(OrderLines, {
  path: '/order-lines',
  includeBasic: ['read', 'create', 'update']
})

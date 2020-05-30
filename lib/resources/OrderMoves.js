import Resource from '../Resource'

export default class OrderMoves extends Resource {}

Resource.addBasicMethods(OrderMoves, {
  path: '/order-moves',
  includeBasic: ['read', 'create', 'update']
})

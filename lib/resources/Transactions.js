import Resource from '../Resource'

const method = Resource.method

export default class Transactions extends Resource {}

Resource.addBasicMethods(Transactions, {
  path: '/transactions',
  includeBasic: ['list', 'read', 'create', 'update']
})

Transactions.prototype.createTransition = method({
  path: '/transactions/:id/transitions',
  method: 'POST',
  urlParams: ['id']
})

import Resource from '../Resource'

export default class TransactionMoves extends Resource {}

Resource.addBasicMethods(TransactionMoves, {
  path: '/transaction_moves',
  includeBasic: ['read', 'create', 'update']
})

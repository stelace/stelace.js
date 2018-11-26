import Resource from '../Resource'

export default class TransactionLines extends Resource {}

Resource.addBasicMethods(TransactionLines, {
  path: '/transaction_lines',
  includeBasic: ['read', 'create', 'update']
})

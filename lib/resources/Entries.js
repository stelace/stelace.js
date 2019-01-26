import Resource from '../Resource'

export default class Entries extends Resource {}

Resource.addBasicMethods(Entries, {
  path: '/entries',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

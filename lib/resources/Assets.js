import Resource from '../Resource'

export default class Assets extends Resource {}

Resource.addBasicMethods(Assets, {
  path: '/assets',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

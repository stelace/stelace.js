import Resource from '../Resource'

export default class Tasks extends Resource {}

Resource.addBasicMethods(Tasks, {
  path: '/tasks',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

import Resource from '../Resource'

export default class Events extends Resource {}

Resource.addBasicMethods(Events, {
  path: '/events',
  includeBasic: ['list', 'read', 'create']
})

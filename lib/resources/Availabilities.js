import Resource from '../Resource'

export default class Availabilities extends Resource {}

Resource.addBasicMethods(Availabilities, {
  path: '/availabilities',
  includeBasic: ['list', 'create', 'update', 'remove']
})

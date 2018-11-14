import Resource from '../Resource'

export default class Messages extends Resource {}

Resource.addBasicMethods(Messages, {
  path: '/messages',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

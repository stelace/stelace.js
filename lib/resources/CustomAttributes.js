import Resource from '../Resource'

export default class CustomAttributes extends Resource {}

Resource.addBasicMethods(CustomAttributes, {
  path: '/custom-attributes',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

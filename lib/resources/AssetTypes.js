import Resource from '../Resource'

export default class AssetTypes extends Resource {}

Resource.addBasicMethods(AssetTypes, {
  path: '/asset-types',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
})

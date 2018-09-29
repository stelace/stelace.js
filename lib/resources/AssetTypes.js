import Resource from '../Resource'

const method = Resource.method

export default class AssetTypes extends Resource {}

Resource.addBasicMethods(AssetTypes, {
  path: '/asset-types',
  includeBasic: ['read', 'create', 'update', 'remove']
})

AssetTypes.prototype.list = method({
  path: '/asset-types',
  method: 'GET'
})

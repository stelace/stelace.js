import Resource from '../Resource'

const method = Resource.method

export default class Permissions extends Resource {}

Permissions.prototype.check = method({
  path: '/permissions/check',
  method: 'POST'
})

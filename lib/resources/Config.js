import Resource from '../Resource'

const method = Resource.method

export default class Config extends Resource {}

Config.prototype.read = method({
  path: '/config',
  method: 'GET'
})

Config.prototype.update = method({
  path: '/config',
  method: 'PATCH'
})

Config.prototype.readPrivate = method({
  path: '/config/private',
  method: 'GET'
})

Config.prototype.updatePrivate = method({
  path: '/config/private',
  method: 'PATCH'
})

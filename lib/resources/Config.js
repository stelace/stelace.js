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

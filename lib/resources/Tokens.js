import Resource from '../Resource'

const method = Resource.method

export default class Tokens extends Resource {}

Tokens.prototype.checkRequest = method({
  path: '/token/check/request',
  method: 'POST'
})

Tokens.prototype.checkConfirm = method({
  path: '/token/check/:token',
  method: 'GET',
  urlParams: ['token']
})

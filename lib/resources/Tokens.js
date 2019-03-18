import Resource from '../Resource'

const method = Resource.method

export default class Tokens extends Resource {}

Tokens.prototype.checkRequest = method({
  path: '/tokens/check/request',
  method: 'POST'
})

Tokens.prototype.checkConfirm = method({
  path: '/tokens/check/:token',
  method: 'GET',
  urlParams: ['token']
})

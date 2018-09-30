import Resource from '../Resource'

const method = Resource.method

export default class Password extends Resource {}

Password.prototype.change = method({
  path: '/password/change',
  method: 'POST'
})

Password.prototype.resetRequest = method({
  path: '/password/reset/request',
  method: 'POST'
})

Password.prototype.resetConfirm = method({
  path: '/password/reset/confirm',
  method: 'POST'
})

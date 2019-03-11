import Resource from '../Resource'

const method = Resource.method

export default class Providers extends Resource {}

Providers.prototype.stripeRequest = method({
  path: '/providers/stripe/request',
  method: 'POST'
})

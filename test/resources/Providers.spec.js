import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('stripeRequest: sends the correct request', (t) => {
  const data = {
    method: 'GET',
    url: '/v1/charges',
    body: {
      amount: 2000,
      currency: 'usd',
      source: 'tok_mastercard',
      description: 'Charge example'
    }
  }

  return stelace.providers.stripeRequest(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/providers/stripe/request',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

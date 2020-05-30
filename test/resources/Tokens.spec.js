import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('checkRequest: sends the correct request', (t) => {
  const expirationDate = new Date((new Date().getTime() + 3600 * 1000)).toISOString()

  const data = {
    type: 'email',
    expirationDate,
    data: {
      someData: true
    }
  }

  return stelace.tokens.checkRequest(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/token/check/request',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('checkConfirm: sends the correct request', (t) => {
  return stelace.tokens.checkConfirm('token_1', { redirect: 'https://example.com' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/token/check/token_1',
        data: {},
        queryParams: { redirect: 'https://example.com' },
        headers: {}
      })
    })
})

import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('checkRequest: sends the correct request', (t) => {
  return stelace.tokens.checkRequest({ userId: 'user_1', type: 'email' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/tokens/check/request',
        data: { userId: 'user_1', type: 'email' },
        queryParams: {},
        headers: {}
      })
    })
})

test('checkConfirm: sends the correct request', (t) => {
  return stelace.tokens.checkConfirm('token_1', { redirect: true })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/tokens/check/token_1',
        data: {},
        queryParams: { redirect: true },
        headers: {}
      })
    })
})

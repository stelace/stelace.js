import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('read: sends the correct request', (t) => {
  return stelace.config.read()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/config',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.config.update({ assetsValidationAutomatic: true })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/config',
        data: { assetsValidationAutomatic: true },
        queryParams: {},
        headers: {}
      })
    })
})

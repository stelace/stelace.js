import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('check: sends the correct request', (t) => {
  const data = {
    permissions: [
      'asset:create:all',
      'category:read:all'
    ]
  }

  return stelace.permissions.check(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/permissions/check',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

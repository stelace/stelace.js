import test from 'blue-tape'

import { getSpyableStelace } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  const data = {
    query: 'Toyota',
    page: 2,
    nbResultsPerPage: 10,
    location: {
      latitude: 22,
      longitude: 10
    }
  }

  return stelace.search.list(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/search',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

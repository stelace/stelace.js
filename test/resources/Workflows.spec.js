import test from 'blue-tape'

import { getSpyableStelace, maxNbResultsPerPage } from '../../testUtils'

const stelace = getSpyableStelace()

test('list: sends the correct request', (t) => {
  return stelace.workflows.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/workflows',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
})

test('[2019-05-20] list: sends the correct request', (t) => {
  return stelace.workflows.list({ stelaceVersion: '2019-05-20' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/workflows',
        data: {},
        queryParams: {},
        headers: {
          'x-stelace-version': '2019-05-20'
        }
      })
    })
})

test('read: sends the correct request', (t) => {
  return stelace.workflows.read('workflow_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/workflows/workflow_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('create: sends the correct request', (t) => {
  const now = new Date().toISOString()

  const data = {
    name: 'Test workflow',
    event: 'asset__created',
    notifyUrl: 'https://example.com',
    computed: {
      assetTypeId: 'S.get("assetType", "id")',
      someString: "'wrapped in simple quotes'",
      startDate: `'${now}'`,
      endDate: `new Date(new Date('${now}').getTime() + (14 * 24 * 60 * 60 * 1000)).toISOString()`
    },
    run: {
      action: 'PATCH',
      endpointPath: '/asset-types/${computed.assetTypeId}', // eslint-disable-line no-template-curly-in-string
      endpointPayload: {
        metadata: {
          date1: 'computed.startDate',
          date2: 'computed.endDate',
          someString: 'computed.someString',
          otherString: "'works too'",
          assetId: 'computed.assetId',
          someResponse: 'S.get("endpointResponses", "id")'
        }
      }
    }
  }

  return stelace.workflows.create(data)
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/workflows',
        data,
        queryParams: {},
        headers: {}
      })
    })
})

test('update: sends the correct request', (t) => {
  return stelace.workflows.update('workflow_1', { name: 'Updated workflow' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'PATCH',
        path: '/workflows/workflow_1',
        data: { name: 'Updated workflow' },
        queryParams: {},
        headers: {}
      })
    })
})

test('remove: sends the correct request', (t) => {
  return stelace.workflows.remove('workflow_1')
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'DELETE',
        path: '/workflows/workflow_1',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

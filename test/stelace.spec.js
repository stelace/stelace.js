import test from 'blue-tape'
import sinon from 'sinon'

import {
  getApiKey,
  getSpyableStelace,
  getStelaceStub,
  encodeJwtToken,
  maxNbResultsPerPage
} from '../testUtils'

import {
  decodeBase64
} from '../lib/utils'

import { Stelace, createInstance } from '../lib/stelace'

test('Sets the API key', (t) => {
  const stelace = createInstance({
    apiKey: 'seck_test_example1'
  })
  t.is(stelace.getApiField('key'), 'seck_test_example1')

  stelace.setApiKey('seck_test_example2')
  t.is(stelace.getApiField('key'), 'seck_test_example2')

  t.end()
})

test('Set a custom timeout', (t) => {
  const stelace = getSpyableStelace()

  t.is(stelace.getApiField('timeout'), Stelace.DEFAULT_TIMEOUT)

  stelace.setTimeout(100)
  t.is(stelace.getApiField('timeout'), 100)

  stelace.setTimeout(null)
  t.is(stelace.getApiField('timeout'), Stelace.DEFAULT_TIMEOUT)

  t.end()
})

test('Methods work with callback', (t) => {
  const stelace = getSpyableStelace()

  t.plan(2)

  stelace.categories.list((err, categories) => {
    t.notOk(err)
    t.ok(categories)
    t.end()
  })
})

test('Methods return a promise', (t) => {
  const stelace = getSpyableStelace()

  return stelace.categories.list()
    .then(categories => t.ok(categories))
    .catch(err => t.notOk(err))
})

test('Sets Authorization header with token and apiKey', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()
  const baseURL = stelace.auth.getBaseURL()
  const accessToken = encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' })
  const testApiKey = getApiKey({ type: 'pubk' })

  const basicAuthorizationRegex = /Basic\s(.*)/i
  // Stelace custom Authorization scheme params
  // https://tools.ietf.org/html/draft-ietf-httpbis-p7-auth-19#appendix-B
  const stelaceSchemeParamRegex = /(apiKey|token)\s?=\s?([^,\s]*)/ig
  const expectedParams = {
    apiKey: testApiKey,
    token: accessToken
  }
  // Expects RegExp exec object
  const validateSchemeParam = exec => exec && exec[2] === expectedParams[exec[1]]

  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    method: 'post',
    headers: { 'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0' },
    response: {
      tokenType: 'Bearer',
      userId: 'user_1',
      accessToken,
      refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
    }
  })

  stelace.stubRequest(`${baseURL}/users/user_1`, {
    status: 200,
    method: 'get',
    headers: { 'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae' },
    response: {
      id: 'user_1',
      username: 'foo',
      firstname: 'Foo',
      lastname: 'Bar'
    }
  })

  stelace.stubRequest(`${baseURL}/auth/logout`, {
    status: 200,
    method: 'post',
    headers: { 'x-request-id': 'e79a0f16-ebd1-468a-b35d-9ea9f6bcff0d' },
    response: { success: true }
  })

  return stelace.users.read('user_1')
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers
      const basic = headers.authorization.match(basicAuthorizationRegex)

      t.true(decodeBase64(basic[1]) === `${testApiKey}:`)

      return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers
      const basic = headers.authorization.match(basicAuthorizationRegex)

      t.true(decodeBase64(basic[1]) === `${testApiKey}:`)

      return stelace.users.read('user_1')
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      const stelaceSchemeParam1 = stelaceSchemeParamRegex.exec(headers.authorization)
      const stelaceSchemeParam2 = stelaceSchemeParamRegex.exec(headers.authorization)
      // Should reset RexExp lastIndex
      const stelaceSchemeParam3 = stelaceSchemeParamRegex.exec(headers.authorization)

      t.true(headers.authorization.startsWith('Stelace-V1 '))
      t.true(headers.authorization.includes(',')) // 2 auth-params
      // Checking we have both apiKey and token
      t.not(stelaceSchemeParam1[1], stelaceSchemeParam2[1])
      t.not(stelaceSchemeParam1[2], stelaceSchemeParam2[2])
      t.true(stelaceSchemeParam3 === null)
      t.true(validateSchemeParam(stelaceSchemeParam1))
      t.true(validateSchemeParam(stelaceSchemeParam2))

      return stelace.auth.logout()
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      const stelaceSchemeParam1 = stelaceSchemeParamRegex.exec(headers.authorization)
      const stelaceSchemeParam2 = stelaceSchemeParamRegex.exec(headers.authorization)
      const stelaceSchemeParam3 = stelaceSchemeParamRegex.exec(headers.authorization)

      t.true(headers.authorization.startsWith('Stelace-V1 '))
      t.true(headers.authorization.includes(',')) // 2 auth-params
      // Checking we have both apiKey and token
      t.not(stelaceSchemeParam1[1], stelaceSchemeParam2[1])
      t.not(stelaceSchemeParam1[2], stelaceSchemeParam2[2])
      t.true(stelaceSchemeParam3 === null)
      t.true(validateSchemeParam(stelaceSchemeParam1))
      t.true(validateSchemeParam(stelaceSchemeParam2))

      return stelace.users.read('user_1')
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers
      const basic = headers.authorization.match(basicAuthorizationRegex)

      t.true(decodeBase64(basic[1]) === `${testApiKey}:`)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Does not set Basic Authorization header when apiKey is missing', (t) => {
  const stelace = getStelaceStub({ noKey: true })
  stelace.startStub()
  const baseURL = stelace.auth.getBaseURL()

  stelace.stubRequest(`${baseURL}/search`, {
    status: 200,
    method: 'post',
    headers: { 'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae' },
    response: {
      page: 1,
      nbResults: 0,
      results: []
    }
  })

  return stelace.search.list({ query: 'test' })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      t.notOk(headers.authorization)
    })
    .then(stelace.stopStub)
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Set the API version for a specific request', (t) => {
  const stelace = getSpyableStelace()

  const stelaceVersion = '2019-05-20'

  return stelace.categories.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
    .then(() => {
      return stelace.categories.list({ stelaceVersion })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {}, // no pagination
        headers: {
          'x-stelace-version': stelaceVersion
        }
      })
    })
})

test('Set the target user for a specific request', (t) => {
  const stelace = getSpyableStelace()

  return stelace.categories.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
    .then(() => {
      return stelace.categories.list({ stelaceUserId: 'user_1' })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/categories',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {
          'x-stelace-user-id': 'user_1'
        }
      })
    })
})

test('Set the target organization for a specific request', (t) => {
  const stelace = getSpyableStelace()

  return stelace.users.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {}
      })
    })
    .then(() => {
      return stelace.users.list({ stelaceOrganizationId: 'organization_1' })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {
          'x-stelace-organization-id': 'organization_1'
        }
      })
    })
})

test('Override the global target organization for a specific request', (t) => {
  const stelace = getSpyableStelace()

  stelace.setOrganizationId('organization_1')

  return stelace.users.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {} // global headers don't display here
      })
    })
    .then(() => {
      return stelace.users.list({ stelaceOrganizationId: 'organization_2' })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {
          'x-stelace-organization-id': 'organization_2'
        }
      })
    })
})

test('Remove the target organization for a specific request', (t) => {
  const stelace = getSpyableStelace()

  stelace.setOrganizationId('organization_1')

  return stelace.users.list()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {} // global headers don't display here
      })
    })
    .then(() => {
      return stelace.users.list({ stelaceOrganizationId: null })
    })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'GET',
        path: '/users',
        data: {},
        queryParams: {
          nbResultsPerPage: maxNbResultsPerPage // automatically added
        },
        headers: {
          'x-stelace-organization-id': null // null value will be removed when sending the requets
        }
      })
    })
})

test('Sets the token store', (t) => {
  const stelace = getSpyableStelace()

  const tokenStore = {
    getTokens: function () {},
    setTokens: function () {},
    removeTokens: function () {}
  }

  stelace.setTokenStore(tokenStore)
  t.is(stelace.getApiField('tokenStore'), tokenStore)
  t.end()
})

test('Methods return lastResponse', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  stelace.stubRequest(`${baseURL}/assets/asset_1`, {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: { id: 'asset_1', name: 'Asset 1' }
  })

  return stelace.assets.read('asset_1')
    .then(asset => {
      t.deepEqual(asset, { id: 'asset_1', name: 'Asset 1' })
      t.deepEqual(asset.lastResponse, {
        statusCode: 200,
        requestId: 'f1f25173-32a5-48da-aa2f-0079568abea0'
      })
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Methods return paginationMeta for list endpoints', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.assets.getBaseURL()
  stelace.stubRequest(`${baseURL}/assets?nbResultsPerPage=${maxNbResultsPerPage}`, {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: {
      nbResults: 2,
      nbPages: 1,
      page: 1,
      nbResultsPerPage: 10,
      results: [{ id: 'asset_1', name: 'Asset 1' }, { id: 'asset_2', name: 'Asset 2' }]
    }
  })
  stelace.stubRequest(`${baseURL}/users?nbResultsPerPage=${maxNbResultsPerPage}`, {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'b8eb517d-5f2e-4a49-83f2-321e66a980fb'
    },
    response: {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: 'startCursor',
      endCursor: 'endCursor',
      nbResultsPerPage: 10,
      results: [{ id: 'user_1', displayName: 'User 1' }, { id: 'User_2', displayName: 'user 2' }]
    }
  })

  return stelace.assets.list()
    .then(assets => {
      // offset pagination
      t.deepEqual(assets, [{ id: 'asset_1', name: 'Asset 1' }, { id: 'asset_2', name: 'Asset 2' }])
      t.deepEqual(assets.lastResponse, {
        statusCode: 200,
        requestId: 'f1f25173-32a5-48da-aa2f-0079568abea0'
      })
      t.deepEqual(assets.paginationMeta, {
        nbResults: 2,
        nbPages: 1,
        page: 1,
        nbResultsPerPage: 10
      })

      return stelace.users.list()
    })
    .then(users => {
      // cursor pagination
      t.deepEqual(users, [{ id: 'user_1', displayName: 'User 1' }, { id: 'User_2', displayName: 'user 2' }])
      t.deepEqual(users.lastResponse, {
        statusCode: 200,
        requestId: 'b8eb517d-5f2e-4a49-83f2-321e66a980fb'
      })
      t.deepEqual(users.paginationMeta, {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: 'startCursor',
        endCursor: 'endCursor',
        nbResultsPerPage: 10,
      })
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Methods return array from list endpoints without pagination', (t) => {
  const stelace = getStelaceStub()

  stelace.startStub()

  const baseURL = stelace.workflows.getBaseURL()
  stelace.stubRequest(`${baseURL}/workflows`, {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: []
  })
  stelace.stubRequest(`${baseURL}/webhooks`, {
    status: 200,
    method: 'get',
    headers: {
      'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae'
    },
    response: [{ id: 'webhook_1', name: 'Webhook 1' }, { id: 'webhook_2', name: 'Webhook 2' }]
  })

  return stelace.workflows.list({ stelaceVersion: '2019-05-20' })
    .then(workflows => {
      t.true(Array.isArray(workflows))
      t.is(workflows.length, 0)
      t.deepEqual(workflows.lastResponse, {
        statusCode: 200,
        requestId: 'f1f25173-32a5-48da-aa2f-0079568abea0'
      })

      return stelace.webhooks.list({ stelaceVersion: '2019-05-20' })
    })
    .then(webhooks => {
      t.true(Array.isArray(webhooks))
      t.deepEqual(webhooks, [{ id: 'webhook_1', name: 'Webhook 1' }, { id: 'webhook_2', name: 'Webhook 2' }])
      t.deepEqual(webhooks.lastResponse, {
        statusCode: 200,
        requestId: 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae'
      })
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Emits an event when the user session has expired', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })

  stelace.startStub()

  const clock = sinon.useFakeTimers()

  const baseURL = stelace.auth.getBaseURL()
  const accessToken = encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' })

  let called1 = 0
  let called2 = 0

  let firstError
  let secondError

  const unsubscribe1 = stelace.onError('userSessionExpired', () => { called1 += 1 })
  stelace.onError('userSessionExpired', () => { called2 += 1 })

  stelace.stubRequest(`${baseURL}/auth/token`, {
    status: 403,
    method: 'post',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: {
      message: 'Refresh token expired'
    }
  })

  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    method: 'post',
    headers: { 'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0' },
    response: {
      tokenType: 'Bearer',
      userId: 'user_1',
      accessToken,
      refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
    }
  })

  stelace.stubRequest(`${baseURL}/assets?nbResultsPerPage=${maxNbResultsPerPage}`, {
    status: 200,
    method: 'get',
    headers: { 'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae' },
    response: {
      nbResults: 0,
      nbPages: 0,
      page: 1,
      nbResultsPerPage: 20,
      results: []
    }
  })

  return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    .then(() => {
      clock.tick(1000)
      return stelace.assets.list()
    })
    .then(() => {
      clock.tick(3600 * 1000)
      return stelace.assets.list()
        .catch(err => { firstError = err })
    })
    .then(() => {
      unsubscribe1()

      // recreate the authentication tokens
      return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    })
    .then(() => {
      return stelace.assets.list()
        .catch(err => { secondError = err })
    })
    .then(() => {
      t.ok(firstError)
      t.ok(secondError)

      t.is(called1, 1)
      t.is(called2, 2)

      stelace.stopStub()
      clock.restore()

      const tokenStore = stelace.getTokenStore()
      tokenStore.removeTokens() // clear tokens for other tests
    })
})

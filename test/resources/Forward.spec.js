import test from 'blue-tape'

import { getStelaceStub, encodeJwtToken } from '../../testUtils'

function initStubbedRequests (stelace) {
  const baseURL = stelace.auth.getBaseURL()
  stelace.stubRequest(`${baseURL}/relative/url`, {
    status: 200,
    method: 'any',
    response: {
      success: true
    }
  })

  stelace.stubRequest('https://absolute-url.com/with/path', {
    status: 200,
    method: 'any',
    response: {
      test: true
    }
  })

  const response = {
    tokenType: 'Bearer',
    userId: 'user_1',
    accessToken: encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' }),
    refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
  }

  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    method: 'post',
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response
  })
}

function checkForwardResponse ({ t, stelace, method, data }) {
  const promiseFn = (url, data) => {
    const mapMethods = {
      delete: 'del'
    }

    const m = mapMethods[method] || method
    if (data) return stelace.forward[m](url, data)
    else return stelace.forward[m](url)
  }

  return promiseFn('/relative/url', data)
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      t.is(request.config.method, method)
      t.is(request.config.url, '/relative/url')
      t.true(headers.authorization.startsWith('Basic'))

      if (data) t.is(request.config.data, JSON.stringify(data))
      else t.is(request.config.data, data)
    })
    .then(() => {
      return promiseFn('https://absolute-url.com/with/path', data)
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      t.is(request.config.method, method)
      t.is(request.config.url, 'https://absolute-url.com/with/path')
      t.true(headers.authorization.startsWith('Basic'))

      if (data) t.is(request.config.data, JSON.stringify(data))
      else t.is(request.config.data, data)
    })
    .then(() => {
      return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    })
    .then(() => {
      return promiseFn('https://absolute-url.com/with/path', data)
    })
    .then(() => {
      const request = stelace.getLastRequest()
      const headers = request.config.headers

      t.is(request.config.method, method)
      t.is(request.config.url, 'https://absolute-url.com/with/path')
      t.true(headers.authorization.startsWith('Stelace-V1'))

      if (data) t.is(request.config.data, JSON.stringify(data))
      else t.is(request.config.data, data)
    })
}

test('get: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'get' })
})

test('post: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'post', data: { boolean: true, string: 'test' } })
})

test('put: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'put', data: { boolean: true, string: 'test' } })
})

test('patch: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'patch', data: { boolean: true, string: 'test' } })
})

test('del: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'delete' })
})

test('options: sends the correct request', (t) => {
  const stelace = getStelaceStub({ keyType: 'pubk' })
  stelace.startStub()

  initStubbedRequests(stelace)
  return checkForwardResponse({ t, stelace, method: 'options' })
})

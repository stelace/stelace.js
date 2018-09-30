import test from 'blue-tape'
import sinon from 'sinon'

import { getSpyableStelace, getStelaceStub, encodeJwtToken } from '../../testUtils'

const stelace = getSpyableStelace()

test('login: sends the correct request', (t) => {
  return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/auth/login',
        data: { username: 'foo', password: 'secretPassword' },
        queryParams: {},
        headers: {}
      })
    })
})

test('logout: sends the correct request', (t) => {
  return stelace.auth.logout()
    .then(() => {
      t.deepEqual(stelace.LAST_REQUEST, {
        method: 'POST',
        path: '/auth/logout',
        data: {},
        queryParams: {},
        headers: {}
      })
    })
})

test('Stores authentication tokens after login', (t) => {
  const stelace = getStelaceStub({ keyType: 'pk' })

  stelace.startStub()

  const response = {
    tokenType: 'Bearer',
    userId: 'user_1',
    accessToken: encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' }),
    refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
  }

  const baseURL = stelace.auth.getBaseURL()
  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response
  })

  const tokenStore = stelace.getApiField('tokenStore')

  t.notOk(tokenStore.getTokens())

  return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    .then(() => {
      const tokens = tokenStore.getTokens()
      t.is(tokens.accessToken, response.accessToken)
      t.is(tokens.refreshToken, response.refreshToken)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Removes authentication tokens after logout', (t) => {
  const stelace = getStelaceStub({ keyType: 'pk' })

  stelace.startStub()

  const response = {
    tokenType: 'Bearer',
    userId: 'user_1',
    accessToken: encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' }),
    refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
  }

  const baseURL = stelace.auth.getBaseURL()
  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response
  })
  stelace.stubRequest(`${baseURL}/auth/logout`, {
    status: 200,
    headers: {
      'x-request-id': 'e79a0f16-ebd1-468a-b35d-9ea9f6bcff0d'
    },
    response: { success: true }
  })

  const tokenStore = stelace.getApiField('tokenStore')

  t.notOk(tokenStore.getTokens())

  return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    .then(() => {
      const tokens = tokenStore.getTokens()
      t.is(tokens.accessToken, response.accessToken)
      t.is(tokens.refreshToken, response.refreshToken)

      return stelace.auth.logout()
    })
    .then(() => {
      const tokens = tokenStore.getTokens()
      t.notOk(tokens)
    })
    .then(() => stelace.stopStub())
    .catch(err => {
      stelace.stopStub()
      throw err
    })
})

test('Refreshes authentication tokens when access token is expired', (t) => {
  const clock = sinon.useFakeTimers()

  const stelace = getStelaceStub({ keyType: 'pk' })

  const loginResponse = {
    tokenType: 'Bearer',
    userId: 'user_1',
    accessToken: encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' }),
    refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
  }
  const refreshTokenResponse = {
    tokenType: 'Bearer',
    // add num in JWT token to differentiate from the first one
    accessToken: encodeJwtToken({ userId: 'user_1', num: 2 }, { expiresIn: '1h' })
  }

  stelace.startStub()

  const baseURL = stelace.auth.getBaseURL()
  stelace.stubRequest(`${baseURL}/auth/login`, {
    status: 200,
    headers: {
      'x-request-id': 'f1f25173-32a5-48da-aa2f-0079568abea0'
    },
    response: loginResponse
  })
  stelace.stubRequest(`${baseURL}/auth/token`, {
    status: 200,
    headers: {
      'x-request-id': '9a0419b6-8d67-4584-b9bd-8ccb32a95248'
    },
    response: refreshTokenResponse
  })
  stelace.stubRequest(`${baseURL}/assets/asset_1`, {
    status: 200,
    headers: {
      'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae'
    },
    response: {
      id: 'asset_id',
      name: 'Asset example'
    }
  })

  const tokenStore = stelace.getApiField('tokenStore')

  t.notOk(tokenStore.getTokens())

  const isTokenRefreshed = (refreshed) => {
    return stelace.assets.read('asset_1')
      .then(() => {
        const tokens = tokenStore.getTokens()
        t.is(tokens.refreshToken, loginResponse.refreshToken)

        if (refreshed) {
          t.is(tokens.accessToken, refreshTokenResponse.accessToken)
        } else {
          t.is(tokens.accessToken, loginResponse.accessToken)
        }
      })
  }

  return stelace.auth.login({ username: 'foo', password: 'secretPassword' })
    .then(() => {
      const tokens = tokenStore.getTokens()
      t.is(tokens.accessToken, loginResponse.accessToken)
      t.is(tokens.refreshToken, loginResponse.refreshToken)
    })
    .then(() => isTokenRefreshed(false))
    .then(() => {
      clock.tick(3600 * 1000)
      return isTokenRefreshed(false)
    })
    .then(() => {
      clock.tick(1 * 1000)
      return isTokenRefreshed(true)
    })
    .then(() => {
      stelace.stopStub()
      clock.restore()
    })
    .catch(err => {
      stelace.stopStub()
      clock.restore()
      throw err
    })
})

test('Do not need to refresh authentication token if using secret API key', (t) => {
  const clock = sinon.useFakeTimers()

  const stelace = getStelaceStub({ keyType: 'sk' })

  stelace.startStub()

  const tokensToStore = {
    accessToken: encodeJwtToken({ userId: 'user_1' }, { expiresIn: '1h' }),
    refreshToken: '39ac0373-e457-4f7a-970f-20dc7d97e0d4'
  }

  const baseURL = stelace.auth.getBaseURL()
  stelace.stubRequest(`${baseURL}/assets/asset_1`, {
    status: 200,
    headers: {
      'x-request-id': 'ca4b0b1f-2c0b-4eed-858e-d76d097615ae'
    },
    response: {
      id: 'asset_id',
      name: 'Asset example'
    }
  })

  const tokenStore = stelace.getApiField('tokenStore')
  tokenStore.setTokens(tokensToStore)

  t.deepEqual(tokenStore.getTokens(), tokensToStore)

  const checkTokenNotRefreshed = () => {
    return stelace.assets.read('asset_1')
      .then(() => {
        const tokens = tokenStore.getTokens()
        t.is(tokens.refreshToken, tokensToStore.refreshToken)
        t.is(tokens.accessToken, tokensToStore.accessToken)
      })
  }

  return Promise.resolve()
    .then(() => checkTokenNotRefreshed())
    .then(() => {
      clock.tick(3600 * 1000)
      return checkTokenNotRefreshed()
    })
    .then(() => {
      clock.tick(1 * 1000)
      return checkTokenNotRefreshed()
    })
    .then(() => {
      stelace.stopStub()
      clock.restore()
    })
    .catch(err => {
      stelace.stopStub()
      clock.restore()
      throw err
    })
})

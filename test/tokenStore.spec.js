import test from 'blue-tape'

import { createDefaultTokenStore } from '../lib/tokenStore'

test('Stores tokens', (t) => {
  const tokens = {
    accessToken: 'accessTokenExample',
    refreshToken: 'refreshTokenExample'
  }

  const tokenStore = createDefaultTokenStore()

  t.notOk(tokenStore.getTokens())

  tokenStore.setTokens(tokens)
  t.deepEqual(tokenStore.getTokens(), tokens)

  tokenStore.removeTokens(tokens)
  t.notOk(tokenStore.getTokens())

  t.end()
})

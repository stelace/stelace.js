import { createDefaultTokenStore } from './tokenStore'

import ApiKeys from './resources/ApiKeys'
import Assessments from './resources/Assessments'
import Assets from './resources/Assets'
import AssetTypes from './resources/AssetTypes'
import Auth from './resources/Auth'
import Availabilities from './resources/Availabilities'
import Bookings from './resources/Bookings'
import Categories from './resources/Categories'
import Config from './resources/Config'
import CustomAttributes from './resources/CustomAttributes'
import Entries from './resources/Entries'
import Events from './resources/Events'
import Messages from './resources/Messages'
import Password from './resources/Password'
import Permissions from './resources/Permissions'
import Providers from './resources/Providers'
import Ratings from './resources/Ratings'
import Roles from './resources/Roles'
import Search from './resources/Search'
import Transactions from './resources/Transactions'
import TransactionLines from './resources/TransactionLines'
import TransactionMoves from './resources/TransactionMoves'
import Users from './resources/Users'
import Webhooks from './resources/Webhooks'
import Workflows from './resources/Workflows'

const resources = {
  ApiKeys,
  Assessments,
  Assets,
  AssetTypes,
  Auth,
  Availabilities,
  Bookings,
  Categories,
  Config,
  CustomAttributes,
  Entries,
  Events,
  Messages,
  Password,
  Permissions,
  Providers,
  Ratings,
  Roles,
  Search,
  Transactions,
  TransactionLines,
  TransactionMoves,
  Users,
  Webhooks,
  Workflows
}

// export Stelace for tests
export class Stelace {
  /**
   * @param {Object} params
   * @param {String} [params.apiKey]
   * @param {String} [params.apiVersion]
   * @param {Object} [params.tokenStore]
   * @param {Function} [params.beforeRefreshToken]
   */
  constructor (params) {
    if (!params || typeof params !== 'object') {
      throw new Error('A configuration object is expected to initialize Stelace')
    }

    const {
      apiKey,
      apiVersion,
      tokenStore,
      beforeRefreshToken
    } = params

    this._api = {
      key: null,
      host: Stelace.DEFAULT_HOST,
      protocol: Stelace.DEFAULT_PROTOCOL,
      port: Stelace.DEFAULT_PORT,
      version: Stelace.DEFAULT_API_VERSION,
      timeout: Stelace.DEFAULT_TIMEOUT,
      tokenStore: null,
      beforeRefreshToken: null,
      organizationId: null
    }

    this._initResources()
    this.setApiKey(apiKey)
    this.setApiVersion(apiVersion)

    this.setTokenStore(tokenStore || createDefaultTokenStore())

    this.setBeforeRefreshToken(beforeRefreshToken)
  }

  setHost (host, port, protocol) {
    this._setApiField('host', host)
    if (port) {
      this.setPort(port)
    }
    if (protocol) {
      this.setProtocol(protocol)
    }
  }

  setProtocol (protocol) {
    this._setApiField('protocol', protocol.toLowerCase())
  }

  setPort (port) {
    this._setApiField('port', port)
  }

  setApiVersion (key) {
    if (key) {
      this._setApiField('version', key)
    }
  }

  setApiKey (key) {
    if (key) {
      this._setApiField('key', key)
    }
  }

  setTimeout (timeout) {
    this._setApiField('timeout', typeof timeout === 'number' ? timeout : Stelace.DEFAULT_TIMEOUT)
  }

  setTokenStore (tokenStore) {
    const validTokenStore = this.isValidTokenStore(tokenStore)

    if (validTokenStore) {
      this._setApiField('tokenStore', tokenStore)
    }
  }

  isValidTokenStore (tokenStore) {
    return tokenStore &&
      typeof tokenStore === 'object' &&
      typeof tokenStore.getTokens === 'function' &&
      typeof tokenStore.setTokens === 'function' &&
      typeof tokenStore.removeTokens === 'function'
  }

  setBeforeRefreshToken (beforeRefreshToken) {
    if (typeof beforeRefreshToken !== 'function') return

    this._setApiField('beforeRefreshToken', beforeRefreshToken)
  }

  setOrganizationId (organizationId) {
    this._setApiField('organizationId', organizationId)
  }

  getApiField (key) {
    return this._api[key]
  }

  _setApiField (key, value) {
    this._api[key] = value
  }

  getConstant (c) {
    return Stelace[c]
  }

  getUserAgent () {
    let browserUserAgent
    if (typeof window !== 'undefined') {
      browserUserAgent = window.navigator && window.navigator.userAgent
    }

    return Stelace.USER_AGENT_STRING + (browserUserAgent ? ' ' + browserUserAgent : '')
  }

  _initResources () {
    for (const name in resources) {
      const key = name[0].toLowerCase() + name.substring(1)
      this[key] = new resources[name](this)
    }
  }
}

Stelace.DEFAULT_HOST = 'api.stelace.com'
Stelace.DEFAULT_PROTOCOL = 'https'
Stelace.DEFAULT_PORT = 443
Stelace.DEFAULT_API_VERSION = null
Stelace.DEFAULT_TIMEOUT = 30 * 1000 // 30s
Stelace.PACKAGE_VERSION = __VERSION__
Stelace.USER_AGENT_STRING = `Stelace/${Stelace.PACKAGE_VERSION}`

export const createInstance = (...args) => {
  return new Stelace(...args)
}

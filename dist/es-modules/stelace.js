var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { createDefaultTokenStore } from './tokenStore';

import ApiKeys from './resources/ApiKeys';
import Assessments from './resources/Assessments';
import Assets from './resources/Assets';
import AssetTypes from './resources/AssetTypes';
import Auth from './resources/Auth';
import Availabilities from './resources/Availabilities';
import Bookings from './resources/Bookings';
import Categories from './resources/Categories';
import Config from './resources/Config';
import CustomAttributes from './resources/CustomAttributes';
import Entries from './resources/Entries';
import Events from './resources/Events';
import Messages from './resources/Messages';
import Password from './resources/Password';
import Permissions from './resources/Permissions';
import Providers from './resources/Providers';
import Ratings from './resources/Ratings';
import Roles from './resources/Roles';
import Search from './resources/Search';
import Tokens from './resources/Tokens';
import Transactions from './resources/Transactions';
import TransactionLines from './resources/TransactionLines';
import TransactionMoves from './resources/TransactionMoves';
import Users from './resources/Users';
import Webhooks from './resources/Webhooks';
import Workflows from './resources/Workflows';

var resources = {
  ApiKeys: ApiKeys,
  Assessments: Assessments,
  Assets: Assets,
  AssetTypes: AssetTypes,
  Auth: Auth,
  Availabilities: Availabilities,
  Bookings: Bookings,
  Categories: Categories,
  Config: Config,
  CustomAttributes: CustomAttributes,
  Entries: Entries,
  Events: Events,
  Messages: Messages,
  Password: Password,
  Permissions: Permissions,
  Providers: Providers,
  Ratings: Ratings,
  Roles: Roles,
  Search: Search,
  Tokens: Tokens,
  Transactions: Transactions,
  TransactionLines: TransactionLines,
  TransactionMoves: TransactionMoves,
  Users: Users,
  Webhooks: Webhooks,
  Workflows: Workflows

  // export Stelace for tests
};export var Stelace = function () {
  /**
   * @param {Object} params
   * @param {String} [params.apiKey]
   * @param {String} [params.apiVersion]
   * @param {Object} [params.tokenStore]
   * @param {Function} [params.beforeRefreshToken]
   */
  function Stelace(params) {
    _classCallCheck(this, Stelace);

    if (!params || (typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
      throw new Error('A configuration object is expected to initialize Stelace');
    }

    var apiKey = params.apiKey,
        apiVersion = params.apiVersion,
        tokenStore = params.tokenStore,
        beforeRefreshToken = params.beforeRefreshToken;


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
    };

    this._initResources();
    this.setApiKey(apiKey);
    this.setApiVersion(apiVersion);

    this.setTokenStore(tokenStore || createDefaultTokenStore());

    this.setBeforeRefreshToken(beforeRefreshToken);
  }

  _createClass(Stelace, [{
    key: 'setHost',
    value: function setHost(host, port, protocol) {
      this._setApiField('host', host);
      if (port) {
        this.setPort(port);
      }
      if (protocol) {
        this.setProtocol(protocol);
      }
    }
  }, {
    key: 'setProtocol',
    value: function setProtocol(protocol) {
      this._setApiField('protocol', protocol.toLowerCase());
    }
  }, {
    key: 'setPort',
    value: function setPort(port) {
      this._setApiField('port', port);
    }
  }, {
    key: 'setApiVersion',
    value: function setApiVersion(key) {
      if (key) {
        this._setApiField('version', key);
      }
    }
  }, {
    key: 'setApiKey',
    value: function setApiKey(key) {
      if (key) {
        this._setApiField('key', key);
      }
    }
  }, {
    key: 'setTimeout',
    value: function setTimeout(timeout) {
      this._setApiField('timeout', typeof timeout === 'number' ? timeout : Stelace.DEFAULT_TIMEOUT);
    }
  }, {
    key: 'getTokenStore',
    value: function getTokenStore() {
      return this.getApiField('tokenStore') || null;
    }
  }, {
    key: 'setTokenStore',
    value: function setTokenStore(tokenStore) {
      var validTokenStore = this.isValidTokenStore(tokenStore);

      if (validTokenStore) {
        this._setApiField('tokenStore', tokenStore);
      }
    }
  }, {
    key: 'isValidTokenStore',
    value: function isValidTokenStore(tokenStore) {
      return tokenStore && (typeof tokenStore === 'undefined' ? 'undefined' : _typeof(tokenStore)) === 'object' && typeof tokenStore.getTokens === 'function' && typeof tokenStore.setTokens === 'function' && typeof tokenStore.removeTokens === 'function';
    }
  }, {
    key: 'setBeforeRefreshToken',
    value: function setBeforeRefreshToken(beforeRefreshToken) {
      if (typeof beforeRefreshToken !== 'function') return;

      this._setApiField('beforeRefreshToken', beforeRefreshToken);
    }
  }, {
    key: 'setOrganizationId',
    value: function setOrganizationId(organizationId) {
      this._setApiField('organizationId', organizationId);
    }
  }, {
    key: 'getApiField',
    value: function getApiField(key) {
      return this._api[key];
    }
  }, {
    key: '_setApiField',
    value: function _setApiField(key, value) {
      this._api[key] = value;
    }
  }, {
    key: 'getConstant',
    value: function getConstant(c) {
      return Stelace[c];
    }
  }, {
    key: 'getUserAgent',
    value: function getUserAgent() {
      var browserUserAgent = void 0;
      if (typeof window !== 'undefined') {
        browserUserAgent = window.navigator && window.navigator.userAgent;
      }

      return Stelace.USER_AGENT_STRING + (browserUserAgent ? ' ' + browserUserAgent : '');
    }
  }, {
    key: '_initResources',
    value: function _initResources() {
      for (var name in resources) {
        var key = name[0].toLowerCase() + name.substring(1);
        this[key] = new resources[name](this);
      }
    }
  }]);

  return Stelace;
}();

Stelace.DEFAULT_HOST = 'api.stelace.com';
Stelace.DEFAULT_PROTOCOL = 'https';
Stelace.DEFAULT_PORT = 443;
Stelace.DEFAULT_API_VERSION = null;
Stelace.DEFAULT_TIMEOUT = 30 * 1000; // 30s
Stelace.PACKAGE_VERSION = '0.0.11';
Stelace.USER_AGENT_STRING = 'Stelace/' + Stelace.PACKAGE_VERSION;

export var createInstance = function createInstance() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new (Function.prototype.bind.apply(Stelace, [null].concat(args)))();
};
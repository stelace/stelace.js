var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { isSecretApiKey, interpolatePath, getDataFromArgs, getOptionsFromArgs, addReadOnlyProperty, decodeJwtToken, isPromise } from './utils';

function getRequestOpts(requestArgs, spec, tokens) {
  var path = spec.path,
      _spec$method = spec.method,
      method = _spec$method === undefined ? 'GET' : _spec$method,
      _spec$urlParams = spec.urlParams,
      urlParams = _spec$urlParams === undefined ? [] : _spec$urlParams;

  // Don't mutate args externally.

  var args = [].slice.call(requestArgs);

  var requestMethod = method.toUpperCase();

  var urlData = {};

  // Check that all specified url params have been provided
  urlParams.forEach(function (urlParam) {
    var arg = args[0];
    if (typeof arg !== 'string') {
      throw new Error('Stelace: "' + urlParam + '" must be a string, but got: ' + (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) + (' (on API request to ' + requestMethod + ' ' + path + ')'));
    }

    urlData[urlParam] = args.shift();
  });

  var requestPath = path;
  if (urlParams.length) {
    requestPath = interpolatePath(path, urlData);
  }

  // Pull request data/queryParams and options (headers) from args.
  var data = {};
  var queryParams = {};

  if (method === 'GET') {
    queryParams = getDataFromArgs(args);
  } else {
    data = getDataFromArgs(args);
  }

  var options = getOptionsFromArgs(args);

  // Validate that there are no more args.
  if (args.length) {
    throw new Error('Stelace: Unknown arguments (' + args + '). Did you mean to pass an options object?' + (' (on API request to ' + requestMethod + ' ' + path + ')'));
  }

  var headers = Object.assign(options.headers, spec.headers);
  if (tokens && tokens.accessToken) {
    headers['authorization'] = 'Bearer ' + tokens.accessToken;
  }

  return {
    requestMethod: requestMethod,
    requestPath: requestPath,
    queryParams: queryParams,
    data: data,
    headers: headers
  };
}

function createPaginationMeta(res) {
  var paginationMeta = {
    nbResults: res.nbResults,
    nbPages: res.nbPages,
    page: res.page,
    nbResultsPerPage: res.nbResultsPerPage
  };

  var newResponse = res.results || []; // add empty array for tests

  var lastResponse = res.lastResponse;

  // copy the last response from the previous object (is lost otherwise)
  addReadOnlyProperty(newResponse, 'lastResponse', lastResponse);
  addReadOnlyProperty(newResponse, 'paginationMeta', paginationMeta);

  return newResponse;
}

function getTokens(self) {
  return Promise.resolve().then(function () {
    var apiKey = self._stelace.getApiField('key');

    var needsAuthToken = !isSecretApiKey(apiKey);
    if (!needsAuthToken) return;

    var tokenStore = self._stelace.getApiField('tokenStore');
    var tokens = tokenStore.getTokens();
    if (!tokens) return;

    var beforeRefreshToken = self._stelace.getApiField('beforeRefreshToken');

    var canRefreshToken = !!tokens.refreshToken || beforeRefreshToken;
    if (!canRefreshToken) return tokens;

    var accessToken = tokens.accessToken;
    var refreshToken = tokens.refreshToken;

    var parsedAccessToken = decodeJwtToken(accessToken);
    var isExpiredToken = new Date(parsedAccessToken.exp * 1000) < new Date();

    if (!isExpiredToken) {
      return tokens;
    }

    if (beforeRefreshToken) {
      // wrap `beforeRefreshToken` so it can be a callback or a promise
      var beforeRefreshTokenPromise = function beforeRefreshTokenPromise(tokens) {
        return new Promise(function (resolve, reject) {
          var callback = function callback(err, newTokens) {
            if (err) reject(err);else resolve(newTokens);
          };

          var returnedObject = beforeRefreshToken(tokens, callback);

          if (isPromise(returnedObject)) {
            returnedObject.then(resolve).catch(reject);
          }
        });
      };

      return beforeRefreshTokenPromise(tokens).then(function (newTokens) {
        if ((typeof newTokens === 'undefined' ? 'undefined' : _typeof(newTokens)) !== 'object') {
          throw new Error('Wrong result');
        }

        tokenStore.setTokens(newTokens);

        return newTokens;
      }).catch(function () {
        return tokens;
      });
    } else {
      return getNewAccessToken(self, refreshToken).then(function (accessToken) {
        var newTokens = Object.assign({}, tokens, { accessToken: accessToken });
        tokenStore.setTokens(newTokens);

        return newTokens;
      }).catch(function () {
        return tokens;
      });
    }
  });
}

function getNewAccessToken(self, refreshToken) {
  var requestParams = {
    path: '/auth/token',
    method: 'POST',
    data: {
      refreshToken: refreshToken,
      grantType: 'refreshToken'
    }
  };

  return self._request(requestParams).then(function (res) {
    return res.accessToken;
  });
}

export default function makeRequest(self, requestArgs, spec) {
  return Promise.resolve().then(function () {
    return getTokens(self);
  }).then(function (tokens) {
    var opts = getRequestOpts(requestArgs, spec, tokens);

    var requestParams = {
      path: opts.requestPath,
      method: opts.requestMethod,
      data: opts.data,
      queryParams: opts.queryParams,
      options: { headers: opts.headers }
    };

    if (spec.beforeRequest) {
      requestParams = spec.beforeRequest(requestParams, self, tokens);
    }

    return self._request(requestParams).then(function (res) {
      if (spec.paginationMeta) {
        res = createPaginationMeta(res);
      }

      var response = spec.transformResponseData ? spec.transformResponseData(res) : res;
      return response;
    }).then(function (res) {
      if (spec.afterRequest) {
        return spec.afterRequest(res, self);
      }

      return res;
    });
  });
}
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import { interpolatePath, getDataFromArgs, getOptionsFromArgs, addReadOnlyProperty } from './utils';

function getRequestOpts(requestArgs, spec) {
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

export default function makeRequest(self, requestArgs, spec) {
  return Promise.resolve().then(function () {
    var opts = getRequestOpts(requestArgs, spec);

    var requestParams = {
      path: opts.requestPath,
      method: opts.requestMethod,
      data: opts.data,
      queryParams: opts.queryParams,
      options: { headers: opts.headers }
    };

    return self._request(requestParams).then(function (res) {
      if (spec.paginationMeta) {
        res = createPaginationMeta(res);
      }

      var response = spec.transformResponseData ? spec.transformResponseData(res) : res;
      return response;
    });
  });
}
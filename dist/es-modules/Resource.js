import _clone from 'lodash/clone';
import _pickBy from 'lodash/pickBy';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import axios from 'axios';

import method from './method';
import getBasicMethods from './method.basic';
import { addReadOnlyProperty, isBrowser } from './utils';

var Resource = function () {
  function Resource(stelace) {
    _classCallCheck(this, Resource);

    this._stelace = stelace;
  }

  _createClass(Resource, [{
    key: '_request',
    value: function _request(_ref) {
      var path = _ref.path,
          method = _ref.method,
          data = _ref.data,
          queryParams = _ref.queryParams,
          _ref$options = _ref.options,
          options = _ref$options === undefined ? {} : _ref$options;

      var headers = {
        'x-api-key': this._stelace.getApiField('key')

        // cannot set the user agent in browser environment
        // https://github.com/axios/axios/issues/1231
      };if (!isBrowser()) {
        headers['user-agent'] = this._stelace.getUserAgent();
      }

      var apiVersion = this._stelace.getApiField('version');
      if (apiVersion) {
        headers['x-stelace-version'] = apiVersion;
      }

      var organizationId = this._stelace.getApiField('organizationId');
      if (organizationId) {
        headers['x-stelace-organization-id'] = organizationId;
      }

      if (options.headers) {
        Object.assign(headers, options.headers);
      }

      headers = _pickBy(headers, function (key) {
        return typeof key !== 'undefined' && key !== null;
      });

      var requestParams = {
        url: path,
        method: method,
        baseURL: this.getBaseURL(),
        headers: headers,
        timeout: this._stelace.getApiField('timeout')
      };

      if (queryParams && Object.keys(queryParams).length) {
        requestParams.params = queryParams;
      }
      if (data && Object.keys(data).length) {
        requestParams.data = data;
      }

      return axios(requestParams).then(this._responseHandler).catch(this._errorHandler);
    }
  }, {
    key: '_responseHandler',
    value: function _responseHandler(res) {
      var response = _clone(res.data);

      var lastResponse = {
        requestId: res.headers['x-request-id'],
        statusCode: res.status
      };

      addReadOnlyProperty(response, 'lastResponse', lastResponse);

      return response;
    }
  }, {
    key: '_errorHandler',
    value: function _errorHandler(err) {
      if (!err.response) throw err;

      var rawResponse = _clone(err.response);

      // copy all error properties into an Error object
      var errorKeys = Object.keys(rawResponse.data);

      var error = new Error(rawResponse.data.message);
      errorKeys.forEach(function (key) {
        if (key !== 'message') {
          error[key] = rawResponse.data[key];
        }
      });

      var lastResponse = {
        requestId: rawResponse.headers['x-request-id'],
        statusCode: rawResponse.status
      };

      addReadOnlyProperty(error, 'lastResponse', lastResponse);

      throw error;
    }
  }, {
    key: 'getBaseURL',
    value: function getBaseURL() {
      var protocol = this._stelace.getApiField('protocol');
      var host = this._stelace.getApiField('host');
      var port = this._stelace.getApiField('port');

      return protocol + '://' + host + ([80, 443].includes(port) ? '' : ':' + port);
    }
  }], [{
    key: 'addBasicMethods',
    value: function addBasicMethods(resource, _ref2) {
      var path = _ref2.path,
          _ref2$includeBasic = _ref2.includeBasic,
          includeBasic = _ref2$includeBasic === undefined ? [] : _ref2$includeBasic;

      var basicMethods = getBasicMethods(path, method);

      includeBasic.forEach(function (name) {
        resource.prototype[name] = basicMethods[name];
      });
    }
  }]);

  return Resource;
}();

export default Resource;


Resource.method = method;
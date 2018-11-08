import _last from 'lodash/last';
import _isObject from 'lodash/isObject';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import jwtDecode from 'jwt-decode';

var OPTIONS_KEYS = ['stelaceVersion', 'stelaceUserId'];

var hasOwn = {}.hasOwnProperty;

export var isApiKey = function isApiKey(key) {
  if (typeof key !== 'string' || key.length !== 32) return false;

  var parts = key.split('_');
  if (parts.length !== 3) return false;

  var type = parts[0];
  return type.length === 2;
};

export var isSecretApiKey = function isSecretApiKey(key) {
  return isApiKey(key) && key.startsWith('sk_');
};

export var asCallback = function asCallback(promise, cb) {
  if (typeof cb !== 'function') return promise;

  var p = promise.then(function (res) {
    return cb(null, res);
  }).catch(function (err) {
    return setTimeout(function () {
      return cb(err);
    }, 0);
  }); // async throw

  return p;
};

export var isPromise = function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function' && typeof obj.catch === 'function';
};

export var interpolatePath = function interpolatePath(path, data) {
  var newPath = path;
  var keys = Object.keys(data);

  keys.forEach(function (key) {
    newPath = newPath.replace(':' + key, data[key]);
  });

  return newPath;
};

export var isOptionsHash = function isOptionsHash(obj) {
  return _isObject(obj) && OPTIONS_KEYS.some(function (key) {
    return hasOwn.call(obj, key);
  });
};

export var getDataFromArgs = function getDataFromArgs(args) {
  if (!args.length || !_isObject(args[0])) {
    return {};
  }

  if (!isOptionsHash(args[0])) {
    return args.shift();
  }

  var argKeys = Object.keys(args[0]);

  var optionKeysInArgs = argKeys.filter(function (key) {
    return OPTIONS_KEYS.indexOf(key) > -1;
  });

  // In some cases options may be the provided as the first argument.
  // Here we're detecting a case where there are two distinct arguments
  // (the first being args and the second options) and with known
  // option keys in the first so that we can warn the user about it.
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning('Options found in arguments (' + optionKeysInArgs.join(', ') + '). Did you mean to pass an options object? ');
  }

  return {};
};

export var getOptionsFromArgs = function getOptionsFromArgs(args) {
  var opts = {
    headers: {}
  };
  if (args.length > 0) {
    var arg = _last(args);
    if (isOptionsHash(arg)) {
      var params = args.pop();

      var extraKeys = Object.keys(params).filter(function (key) {
        return OPTIONS_KEYS.indexOf(key) === -1;
      });

      if (extraKeys.length) {
        emitWarning('Invalid options found (' + extraKeys.join(', ') + '); ignoring.');
      }

      if (params.stelaceVersion) {
        opts.headers['x-stelace-version'] = params.stelaceVersion;
      }
      if (params.stelaceUserId) {
        opts.headers['x-stelace-user-id'] = params.stelaceUserId;
      }
    }
  }

  return opts;
};

export var addReadOnlyProperty = function addReadOnlyProperty(obj, propertyName, property) {
  Object.defineProperty(obj, propertyName, {
    enumerable: false,
    writable: false,
    value: property
  });
};

export var decodeJwtToken = function decodeJwtToken(jwtToken) {
  return jwtDecode(jwtToken);
};

function emitWarning(warning) {
  if (process) {
    if (typeof process.emitWarning !== 'function') {
      return console.warn('Stelace: ' + warning);
    }

    return process.emitWarning(warning, 'Stelace');
  }
}
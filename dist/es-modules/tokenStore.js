var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import memoryLocalStorage from 'localstorage-memory';

var generateKey = function generateKey(namespace) {
  return namespace + '-authtoken';
};

export var createDefaultTokenStore = function createDefaultTokenStore() {
  var namespace = 'stl';

  var localStorage = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.localStorage || memoryLocalStorage;

  return {
    getTokens: function getTokens() {
      var key = generateKey(namespace);

      var rawValue = localStorage.getItem(key);
      return JSON.parse(rawValue);
    },
    setTokens: function setTokens(tokens) {
      if (!tokens || (typeof tokens === 'undefined' ? 'undefined' : _typeof(tokens)) !== 'object') {
        throw new Error('Expected object as tokens value');
      }

      var key = generateKey(namespace);
      localStorage.setItem(key, JSON.stringify(tokens));
    },
    removeTokens: function removeTokens() {
      var key = generateKey(namespace);
      localStorage.removeItem(key);
    }
  };
};
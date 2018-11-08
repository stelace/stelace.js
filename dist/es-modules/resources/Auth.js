function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';
import { decodeJwtToken } from '../utils';

var method = Resource.method;

var Auth = function (_Resource) {
  _inherits(Auth, _Resource);

  function Auth() {
    _classCallCheck(this, Auth);

    return _possibleConstructorReturn(this, (Auth.__proto__ || Object.getPrototypeOf(Auth)).apply(this, arguments));
  }

  return Auth;
}(Resource);

export default Auth;


Auth.prototype.login = method({
  path: '/auth/login',
  method: 'POST',
  afterRequest: function afterRequest(res, self) {
    var tokenStore = self._stelace.getApiField('tokenStore');

    tokenStore.setTokens(res);

    return res;
  }
});

Auth.prototype.logout = method({
  path: '/auth/logout',
  method: 'POST',
  beforeRequest: function beforeRequest(requestParams, self, tokens) {
    if (tokens && tokens.refreshToken) {
      requestParams.data.refreshToken = tokens.refreshToken;
    }

    return requestParams;
  },
  afterRequest: function afterRequest(res, self) {
    var tokenStore = self._stelace.getApiField('tokenStore');
    tokenStore.removeTokens();

    return res;
  }
});

Auth.prototype.info = function () {
  var tokenStore = this._stelace.getApiField('tokenStore');

  var infoResult = {
    isAuthenticated: false,
    userId: null
  };

  if (!tokenStore) return infoResult;

  var tokens = tokenStore.getTokens();
  if (!tokens || !tokens.accessToken) return infoResult;

  try {
    var parsedToken = decodeJwtToken(tokens.accessToken);
    infoResult.isAuthenticated = true;
    infoResult.userId = parsedToken.userId;

    return infoResult;
  } catch (err) {
    return infoResult;
  }
};
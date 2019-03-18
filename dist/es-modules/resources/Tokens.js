function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Tokens = function (_Resource) {
  _inherits(Tokens, _Resource);

  function Tokens() {
    _classCallCheck(this, Tokens);

    return _possibleConstructorReturn(this, (Tokens.__proto__ || Object.getPrototypeOf(Tokens)).apply(this, arguments));
  }

  return Tokens;
}(Resource);

export default Tokens;


Tokens.prototype.checkRequest = method({
  path: '/tokens/check/request',
  method: 'POST'
});

Tokens.prototype.checkConfirm = method({
  path: '/tokens/check/:token',
  method: 'GET',
  urlParams: ['token']
});
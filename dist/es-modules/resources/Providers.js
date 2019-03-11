function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Providers = function (_Resource) {
  _inherits(Providers, _Resource);

  function Providers() {
    _classCallCheck(this, Providers);

    return _possibleConstructorReturn(this, (Providers.__proto__ || Object.getPrototypeOf(Providers)).apply(this, arguments));
  }

  return Providers;
}(Resource);

export default Providers;


Providers.prototype.stripeRequest = method({
  path: '/providers/stripe/request',
  method: 'POST'
});
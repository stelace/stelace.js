function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Webhooks = function (_Resource) {
  _inherits(Webhooks, _Resource);

  function Webhooks() {
    _classCallCheck(this, Webhooks);

    return _possibleConstructorReturn(this, (Webhooks.__proto__ || Object.getPrototypeOf(Webhooks)).apply(this, arguments));
  }

  return Webhooks;
}(Resource);

export default Webhooks;


Resource.addBasicMethods(Webhooks, {
  path: '/webhooks',
  includeBasic: ['read', 'create', 'update', 'remove']
});

Webhooks.prototype.list = method({
  path: '/webhooks',
  method: 'GET'
});
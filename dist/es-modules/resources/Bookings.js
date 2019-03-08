function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Bookings = function (_Resource) {
  _inherits(Bookings, _Resource);

  function Bookings() {
    _classCallCheck(this, Bookings);

    return _possibleConstructorReturn(this, (Bookings.__proto__ || Object.getPrototypeOf(Bookings)).apply(this, arguments));
  }

  return Bookings;
}(Resource);

export default Bookings;


Resource.addBasicMethods(Bookings, {
  path: '/bookings',
  includeBasic: ['list', 'read', 'create', 'update']
});

Bookings.prototype.pay = method({
  path: '/bookings/:id/payments',
  method: 'POST',
  urlParams: ['id']
});

Bookings.prototype.confirm = method({
  path: '/bookings/:id/confirmation',
  method: 'POST',
  urlParams: ['id']
});

Bookings.prototype.accept = method({
  path: '/bookings/:id/acceptation',
  method: 'POST',
  urlParams: ['id']
});

Bookings.prototype.cancel = method({
  path: '/bookings/:id/cancellation',
  method: 'POST',
  urlParams: ['id']
});

Bookings.prototype.process = method({
  path: '/bookings/:id/process',
  method: 'POST',
  urlParams: ['id']
});
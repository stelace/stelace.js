function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Transactions = function (_Resource) {
  _inherits(Transactions, _Resource);

  function Transactions() {
    _classCallCheck(this, Transactions);

    return _possibleConstructorReturn(this, (Transactions.__proto__ || Object.getPrototypeOf(Transactions)).apply(this, arguments));
  }

  return Transactions;
}(Resource);

export default Transactions;


Resource.addBasicMethods(Transactions, {
  path: '/transactions',
  includeBasic: ['list', 'read', 'create', 'update']
});

Transactions.prototype.preview = method({
  path: '/transactions/preview',
  method: 'POST'
});
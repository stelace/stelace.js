function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var TransactionMoves = function (_Resource) {
  _inherits(TransactionMoves, _Resource);

  function TransactionMoves() {
    _classCallCheck(this, TransactionMoves);

    return _possibleConstructorReturn(this, (TransactionMoves.__proto__ || Object.getPrototypeOf(TransactionMoves)).apply(this, arguments));
  }

  return TransactionMoves;
}(Resource);

export default TransactionMoves;


Resource.addBasicMethods(TransactionMoves, {
  path: '/transaction_moves',
  includeBasic: ['read', 'create', 'update']
});
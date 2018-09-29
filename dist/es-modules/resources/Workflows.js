function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Workflows = function (_Resource) {
  _inherits(Workflows, _Resource);

  function Workflows() {
    _classCallCheck(this, Workflows);

    return _possibleConstructorReturn(this, (Workflows.__proto__ || Object.getPrototypeOf(Workflows)).apply(this, arguments));
  }

  return Workflows;
}(Resource);

export default Workflows;


Resource.addBasicMethods(Workflows, {
  path: '/workflows',
  includeBasic: ['read', 'create', 'update', 'remove']
});

Workflows.prototype.list = method({
  path: '/workflows',
  method: 'GET'
});
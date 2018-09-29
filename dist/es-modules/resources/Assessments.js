function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var method = Resource.method;

var Assessments = function (_Resource) {
  _inherits(Assessments, _Resource);

  function Assessments() {
    _classCallCheck(this, Assessments);

    return _possibleConstructorReturn(this, (Assessments.__proto__ || Object.getPrototypeOf(Assessments)).apply(this, arguments));
  }

  return Assessments;
}(Resource);

export default Assessments;


Resource.addBasicMethods(Assessments, {
  path: '/assessments',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
});

Assessments.prototype.sign = method({
  path: '/assessments/:id/signatures',
  method: 'POST',
  urlParams: ['id']
});
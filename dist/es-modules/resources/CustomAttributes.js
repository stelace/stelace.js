function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var CustomAttributes = function (_Resource) {
  _inherits(CustomAttributes, _Resource);

  function CustomAttributes() {
    _classCallCheck(this, CustomAttributes);

    return _possibleConstructorReturn(this, (CustomAttributes.__proto__ || Object.getPrototypeOf(CustomAttributes)).apply(this, arguments));
  }

  return CustomAttributes;
}(Resource);

export default CustomAttributes;


Resource.addBasicMethods(CustomAttributes, {
  path: '/custom-attributes',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
});
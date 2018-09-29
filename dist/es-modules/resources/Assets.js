function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';

var Assets = function (_Resource) {
  _inherits(Assets, _Resource);

  function Assets() {
    _classCallCheck(this, Assets);

    return _possibleConstructorReturn(this, (Assets.__proto__ || Object.getPrototypeOf(Assets)).apply(this, arguments));
  }

  return Assets;
}(Resource);

export default Assets;


Resource.addBasicMethods(Assets, {
  path: '/assets',
  includeBasic: ['list', 'read', 'create', 'update', 'remove']
});
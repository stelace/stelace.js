function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Resource from '../Resource';
import { addReadOnlyProperty } from '../utils';

var method = Resource.method;

var Search = function (_Resource) {
  _inherits(Search, _Resource);

  function Search() {
    _classCallCheck(this, Search);

    return _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).apply(this, arguments));
  }

  return Search;
}(Resource);

export default Search;


Search.prototype.list = method({
  path: '/search',
  method: 'POST',
  transformResponseData: function transformResponseData(res) {
    var lastResponse = res.lastResponse;

    var paginationMeta = {
      nbResults: res.nbResults,
      nbPages: res.nbPages,
      page: res.page,
      nbResultsPerPage: res.nbResultsPerPage,
      exhaustiveNbResults: res.exhaustiveNbResults
    };

    var newResponse = res.assets || []; // add empty array for tests

    addReadOnlyProperty(newResponse, 'lastResponse', lastResponse);
    addReadOnlyProperty(newResponse, 'paginationMeta', paginationMeta);

    return newResponse;
  }
});
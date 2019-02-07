"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _filter = require("lodash/filter");

var _filter2 = _interopRequireDefault(_filter);

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = arr => {
  return (0, _filter2.default)(arr, (val, i, iteratee) => (0, _includes2.default)(iteratee.map(i => i.content), val.content, i + 1));
};
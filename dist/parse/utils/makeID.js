"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsMd = require("js-md5");

var _jsMd2 = _interopRequireDefault(_jsMd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (block, idx, full) => {
  const unique = full.filter(f => f.value === block.value).length === 1;

  if (unique) {
    block.id = (0, _jsMd2.default)(block.value);
  } else {
    block.id = (0, _jsMd2.default)([block.value, idx]);
  }

  return block;
};
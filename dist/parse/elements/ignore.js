"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes = require("lodash/includes");

var _includes2 = _interopRequireDefault(_includes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IGNORE_BLOCKS = ['-------> LIVE TRANSCRIPT HAS ENDED <-----------', '^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^'];
exports.default = {
  name: 'ignore',
  test: block => {
    const isIgnorable = (0, _includes2.default)(IGNORE_BLOCKS, block);
    return {
      pass: isIgnorable
    };
  },
  render: () => null
};
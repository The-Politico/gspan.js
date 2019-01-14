"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _trim = require("lodash/trim");

var _trim2 = _interopRequireDefault(_trim);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'speaker',
  test: block => ({
    pass: true
  }),
  render: (text, block) => {
    if (text) {
      return {
        type: 'speaker',
        value: (0, _trim2.default)(text)
      };
    } else {
      const match = /^[\w|\d|\s]*:(.*)$/.exec(block);
      const spoken = match ? match[1] : block;
      return {
        type: 'speaker',
        value: (0, _trim2.default)(spoken)
      };
    }
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _splitRawFooter = require("./splitRawFooter");

var _splitRawFooter2 = _interopRequireDefault(_splitRawFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = raw => {
  let rawComments = (0, _splitRawFooter2.default)(raw);
  let output = {};
  const blocks = rawComments.split(/\n|\r/).filter(t => t !== '');
  let key = null;
  blocks.forEach(b => {
    const match = /^\[(\w+)\]+(.*)$/.exec(b);

    if (match) {
      key = match[1];
      output[key] = match[2];
    } else {
      output[key] = `${output[key]}\n${b}`;
    }
  });
  return output;
};
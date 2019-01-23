"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _elements = require("./elements");

var _elements2 = _interopRequireDefault(_elements);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = raw => {
  let output = [];

  if (!raw) {
    return output;
  }

  const blocks = raw.split(/\n|\r/).filter(t => t.replace(/^([^\\]?\[(\w+)\])+$/, '') !== '');
  blocks.forEach(b => {
    _elements2.default.some(e => {
      const {
        pass,
        value
      } = e.test(b.trim());

      if (pass) {
        const render = e.render(value, b, output);

        if (render) {
          const addition = Array.isArray(render) ? render : [render];
          output = [...output, ...addition];
        }

        return true;
      }

      return false;
    });
  });
  return output;
};
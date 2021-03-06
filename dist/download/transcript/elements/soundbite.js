"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'soundbite',
  test: block => {
    const match = /^:\[(\(.*\))\]/.exec(block);

    if (match) {
      return {
        pass: true,
        value: match[1]
      };
    } else {
      return {
        pass: false
      };
    }
  },
  render: text => ({
    type: 'soundbite',
    value: text
  })
};
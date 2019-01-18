"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'comment',
  test: block => {
    const match = /^\[(\w+)\]+(\w.*)$/.exec(block);

    if (match) {
      return {
        pass: true,
        value: {
          key: match[1],
          text: match[2]
        }
      };
    } else {
      return {
        pass: false
      };
    }
  },
  render: text => ({
    type: 'comment',
    value: text
  })
};
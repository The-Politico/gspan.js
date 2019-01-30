"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'content',
  test: block => ({
    pass: true
  }),
  render: (text, block) => {
    if (text) {
      return {
        type: 'content',
        value: text.trim()
      };
    } else {
      const match = /^<.*>:(.*)$/.exec(block);
      const spoken = match ? match[1] : block;
      return {
        type: 'content',
        value: spoken.trim()
      };
    }
  }
};
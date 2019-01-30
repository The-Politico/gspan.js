"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (count, comments) => {
  if (comments.length === 0) {
    return;
  }

  const commentsOnPage = comments.filter(c => !c.resolved);
  const realCommentsCount = commentsOnPage.reduce((accumulator, currentValue, idx) => {
    // first iteration
    if (idx === 1) {
      return accumulator.replies.length + currentValue.replies.length + 2;
    } else {
      return accumulator + currentValue.replies.length + 1;
    }
  });

  if (realCommentsCount > count) {
    console.warn(_chalk2.default.yellow(`⚠️ GSpan Warning: Something went wrong. Not enough comment footnotes were removed from the page. ⚠️`));
  } else if (realCommentsCount < count) {
    console.warn(_chalk2.default.yellow(`⚠️ GSpan Warning: Something went wrong. Too many comment footnotes were removed from the page. ⚠️`));
  }
};
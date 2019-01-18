"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = raw => {
  if (raw.indexOf('^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^') > 0) {
    return true;
  }

  return false;
};
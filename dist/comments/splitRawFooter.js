"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = raw => {
  if (!raw) {
    return null;
  }

  const footerParts = raw.split('[a]');

  if (footerParts.length > 1) {
    return `[a]${footerParts[1]}`;
  } else {
    return null;
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _download = require("./download");

Object.defineProperty(exports, "download", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_download).default;
  }
});

var _transcribe = require("./transcribe");

Object.defineProperty(exports, "transcribe", {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_transcribe).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
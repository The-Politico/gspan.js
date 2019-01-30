"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _attribution = require("./attribution");

var _attribution2 = _interopRequireDefault(_attribution);

var _comment = require("./comment");

var _comment2 = _interopRequireDefault(_comment);

var _ignore = require("./ignore");

var _ignore2 = _interopRequireDefault(_ignore);

var _soundbite = require("./soundbite");

var _soundbite2 = _interopRequireDefault(_soundbite);

var _content = require("./content");

var _content2 = _interopRequireDefault(_content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_ignore2.default, _soundbite2.default, _attribution2.default, _comment2.default, _content2.default];
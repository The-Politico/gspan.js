"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = (client, doc, text) => {
  client.append(doc, text);
};
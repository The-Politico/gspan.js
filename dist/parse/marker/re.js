"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const sub = (regexStr, repl, str) => {
  const regex = new RegExp(regexStr, 'g');
  const defString = str || '';
  return defString.replace(regex, repl);
};

const split = (regexStr, str) => {
  const regex = new RegExp(regexStr);
  return str.split(regex);
};

const search = (regexStr, str) => {
  const defString = str || '';
  return !!defString.match(regexStr);
};

exports.default = {
  compile: regex => {
    return {
      regex: new RegExp(regex, 'g'),
      sub: (repl, str) => {
        const defString = str || '';
        return defString.replace(undefined.regex, repl);
      }
    };
  },
  sub,
  split,
  search
};
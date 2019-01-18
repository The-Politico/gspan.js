"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/*
 * Keep running the regex until there are no more matches
 */
const replaceRecursive = (str, rgx, repl, replCount = 0) => {
  if (str.match(rgx)) {
    replCount++;
    return replaceRecursive(str.replace(rgx, repl), rgx, repl, replCount);
  } else {
    return {
      replCount,
      replContent: str
    };
  }
};

exports.default = replaceRecursive;
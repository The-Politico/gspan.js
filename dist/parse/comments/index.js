"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _find = require("lodash/find");

var _find2 = _interopRequireDefault(_find);

var _keys = require("lodash/keys");

var _keys2 = _interopRequireDefault(_keys);

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _marker = require("../marker");

var _marker2 = _interopRequireDefault(_marker);

var _parseRawComments = require("./parseRawComments");

var _parseRawComments2 = _interopRequireDefault(_parseRawComments);

var _findDuplicates = require("../utils/findDuplicates");

var _findDuplicates2 = _interopRequireDefault(_findDuplicates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LINE_BREAKS = /\n|\r/g;
const KEY_VALUE_REGEX = /^([^\s]*)\s*:\s*((?:.|\s)*)$/;
const PUBLISH_REGEX = /^[p|P]ublish$/;
const UNPUBLISH_REGEX = /^[u|U]npublish$/;

exports.default = (rawContent, meta, authors, authorNameAccessor, authorIdAccessor, defaultPublish = true) => {
  const rawComments = (0, _parseRawComments2.default)(rawContent);

  if (!rawComments) {
    return {
      comments: [],
      activeAuthors: {}
    };
  }

  (0, _findDuplicates2.default)(meta).forEach(d => {
    console.warn(_chalk2.default.yellow(`⚠️ GSpan Warning: Found duplicate comment: "${d.content}". ` + `Make sure all comments are unique. ` + `Will ignore all subsequent duplicates. ⚠️`));
  });
  const activeAuthors = {};
  const comments = meta.map(c => {
    if (!c.quotedFileContent) {
      return null;
    }

    const commentKey = (0, _find2.default)((0, _keys2.default)(rawComments), r => rawComments[r].replace(LINE_BREAKS, '') === c.content.replace(LINE_BREAKS, ''));

    if (commentKey === undefined) {
      console.warn(_chalk2.default.yellow(`⚠️ GSpan Warning: The following comment could not be mapped to document content: "${c.content}" ⚠️`));
    } else {
      c.pageKey = commentKey;
    }

    if (c.quotedFileContent.value.length > 600) {
      c.quotedFileContent.truncated = true;
    }

    if (authors) {
      const author = (0, _find2.default)(authors, a => (0, _get2.default)(a, authorNameAccessor, null) === c.author.displayName);

      if (!author) {
        console.warn(_chalk2.default.yellow(`⚠️ GSpan Warning: Could not find an author with the display name: "${c.author.displayName}" ⚠️`));
      }

      const id = (0, _get2.default)(author, authorIdAccessor, null);
      c.author = id;
      activeAuthors[id] = author;
    } else {
      activeAuthors[c.author.displayName] = c.author;
      c.author = c.author.displayName;
    }

    const marker = new _marker2.default();
    c.tags = {};
    c.published = defaultPublish;
    c.replies.forEach(r => {
      const matchKeyValue = KEY_VALUE_REGEX.exec(r.content);

      if (matchKeyValue) {
        if (matchKeyValue[1] === 'Edited' || matchKeyValue[1] === 'edited') {
          c.original = c.content;
          c.content = marker.mark(matchKeyValue[2]);
          return null;
        }

        c.tags[matchKeyValue[1]] = marker.mark(matchKeyValue[2]);
        return null;
      }

      const matchPublish = PUBLISH_REGEX.exec(r.content);

      if (matchPublish) {
        c.published = true;
        return null;
      }

      const matchUnpublish = UNPUBLISH_REGEX.exec(r.content);

      if (matchUnpublish) {
        c.published = false;
        return null;
      }
    });
    return c;
  });
  return {
    comments: comments.filter(c => c !== null),
    activeAuthors
  };
};
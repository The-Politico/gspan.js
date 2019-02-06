"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _re = require("./re");

var _re2 = _interopRequireDefault(_re);

var _interactiveBin = require("@politico/interactive-bin");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const URL_PATTERN = '(?:https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*';

class Marker {
  constructor(markslackLinks = true, replaceEmoji = true, removeBadEmoji = false, linkTemplates = null, userTemplates = null, imageTemplate = null, imageExtensions = ['.jpg', '.png']) {
    this.userTemplates = userTemplates;
    this.markslackLinks = markslackLinks;
    this.replaceEmoji = replaceEmoji;
    this.removeBadEmoji = removeBadEmoji;
    this.replaceEmoji = replaceEmoji;
    this.removeBadEmoji = removeBadEmoji;
    this.imageExtensions = imageExtensions;
    this.imageTemplate = imageTemplate;
    this.linkTemplates = linkTemplates;
  }

  markHyperlinks() {
    this.marked = _re2.default.sub(`(?!\\()(${URL_PATTERN})(?!\\))`, '[$1]($1)', this.marked);
    this.marked = _re2.default.sub(`\\[([^[\\]]+?)\\]\\[${URL_PATTERN}\\]\\((${URL_PATTERN})\\)`, '[$1]($2)', this.marked);
  }

  markEmphasis(self) {
    /*
    Mark bold and italic text.
    In order to ensure emphasis marks render the same in Slack and
    Markdown, we need to escape all underscores and asterisks that
    don't belong to a matched pair. To do that, we first mark the
    matched pairs with a placeholder pattern ('|*'), then escape the
    remaining underscores and asterisks. Finally, we replace the
    placeholders with asterisks.
    */
    // Pattern catches matched pairs
    const regexTemplate = _interactiveBin.templatize`(?<![\\\\|a-zA-Z0-9])\\${0}(.+?)(?<!\\\\)\\${0}(?![a-zA-Z0-9])`; // Replace bold paired asterisks with placeholder

    this.marked = _re2.default.sub(regexTemplate(['*']), '|*|*$1|*|*', this.marked); // Replace italic paired underscores with placeholder

    this.marked = _re2.default.sub(regexTemplate(['_']), '|*$1|*', this.marked); // Escape unmatched, unescaped asterisks-

    this.marked = _re2.default.sub('(?<![\\|\\\\])\\*', '\\*', this.marked);
    this.marked = _re2.default.split(`(${URL_PATTERN})`, this.marked).map(line => !_re2.default.search(URL_PATTERN, line) ? _re2.default.sub('\\_', '\\_', line) : line).join(''); // Replace matched pair placeholders

    this.marked = _re2.default.sub('\\|\\*', '*', this.marked);
  }

  mark(slack) {
    this.slack = slack;
    this.marked = slack;
    this.markHyperlinks();
    this.markEmphasis();
    return this.marked;
  }

}

exports.default = Marker;
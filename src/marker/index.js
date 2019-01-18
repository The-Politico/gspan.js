import re from './re';
import { templatize } from '@politico/interactive-bin';

const URL_PATTERN = '(?:https?|ftp):\\/\\/[^\\s\\/$.?#].[^\\s]*';

class Marker {
  constructor (
    markslackLinks = true,
    replaceEmoji = true,
    removeBadEmoji = false,
    linkTemplates = null,
    userTemplates = null,
    imageTemplate = null,
    imageExtensions = ['.jpg', '.png'],
  ) {
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

  markHyperlinks () {
    this.marked = re.sub(
      `(?!\\()(${URL_PATTERN})(?!\\))`,
      '[$1]($1)',
      this.marked,
    );

    this.marked = re.sub(
      `\\[([\\w ']+?)\\]\\[${URL_PATTERN}\\]\\((${URL_PATTERN})\\)`,
      '[$1]($2)',
      this.marked,
    );
  }

  markEmphasis (self) {
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
    const regexTemplate = templatize`(?<![\\\\|a-zA-Z0-9])\\${0}(.+?)(?<!\\\\)\\${0}(?![a-zA-Z0-9])`;
    // Replace bold paired asterisks with placeholder
    this.marked = re.sub(regexTemplate(['*']), '|*|*$1|*|*', this.marked);
    // Replace italic paired underscores with placeholder
    this.marked = re.sub(regexTemplate(['_']), '|*$1|*', this.marked);

    // Escape unmatched, unescaped asterisks-
    this.marked = re.sub('(?<![\\|\\\\])\\*', '\\*', this.marked);

    this.marked = re.split(`(${URL_PATTERN})`, this.marked).map(
      line => !re.search(URL_PATTERN, line) ?
        re.sub('\\_', '\\_', line) : line
    ).join('');

    // Replace matched pair placeholders
    this.marked = re.sub('\\|\\*', '*', this.marked);
  }

  mark (slack) {
    this.slack = slack;
    this.marked = slack;
    this.markHyperlinks();
    this.markEmphasis();
    return this.marked;
  }
}

export default Marker;

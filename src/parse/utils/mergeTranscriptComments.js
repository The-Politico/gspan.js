import find from 'lodash/find';
import keys from 'lodash/keys';
import chalk from 'chalk';
import HTMLEntities from 'html-entities';
import Marker from '../marker';
import replaceRecursive from './replaceRecursive';
import validateCommentRemoval from './validateCommentRemoval';

const COMMENT_REGEX = /[^\\]\[(\w+)\]/;
const COMMENT_REGEX_REPL = /([^[]*[^\\])\[(\w+)\](.*)/;
const USER_REGEX = /^<.*>:/;
const COMMENT_OVERRIDE_REGEX = code => new RegExp(`(\\{\\{)([^{}]*\\[${code}\\][^{}]*)(\\}\\})`);
const entities = new HTMLEntities.XmlEntities();

export default (transcript, comments) => {
  const getCommentLocations = (content, locations = {}) => {
    const commentRegexMatch = COMMENT_REGEX.exec(content);
    // if there is a comment in the block
    if (commentRegexMatch) {
      const commentCode = commentRegexMatch[1];

      // if the comment code already exists in locations, warn it and do nothing
      if (commentCode in locations) {
        console.warn(chalk.yellow(
          `⚠️ GSpan Warning: Found multiple instances of the same comment footnote: "[${commentCode}]". ` +
          `Make sure to escape intentional square brackets like this: "\\[word]". ` +
          `Will default to the first instance. ⚠️`
        ));
      // if this comment is new, continue...
      } else {
        const overrideRegex = COMMENT_OVERRIDE_REGEX(commentCode);
        const overrideRegexMatch = overrideRegex.exec(content);
        // if this comment is within an override "{{ }}" syntax, handle that
        if (overrideRegexMatch) {
          const endpoint = overrideRegexMatch.index + overrideRegexMatch[2].length - 2 - commentCode.length;
          locations[commentCode] = [overrideRegexMatch.index, endpoint];
          content = content.replace(overrideRegex, '$2');
        // if it's not, just log the endpoint, the start will be inferred after merging
        } else {
          // the +1 is because the regex is matching on the character before the "[" to check for comments
          locations[commentCode] = commentRegexMatch.index + 1;
        }
      }

      content = content.replace(`[${commentCode}]`, '');
      return getCommentLocations(content, locations);
    } else {
      return locations;
    }
  };

  const marker = new Marker();

  let commentsRemoved = 0;

  const contents = transcript.map(b => {
    const content = b.value;
    const locations = getCommentLocations(content);

    // Remove {{ }} from override comments
    b.value = content.replace(/\{\{([^{}]*\[\w*\][^{}]*)\}\}/g, '$1');

    // Remove [a] comment tags
    const commentRegexGlobal = new RegExp(COMMENT_REGEX_REPL, 'g');
    const {replCount, replContent} = replaceRecursive(b.value, commentRegexGlobal, '$1$3');
    b.value = replContent;
    commentsRemoved += replCount;

    // Remove \[word] escapes
    b.value = b.value.replace(/\\(\[\w*\])/g, '$1');

    b.annotations = keys(locations).map(l => {
      const comment = find(comments, c => c.pageKey === l);
      if (!comment) { return null; }

      let location = [];
      if (Array.isArray(locations[l])) {
        location = locations[l];
      } else {
        location[1] = locations[l];
        if (!comment.quotedFileContent.truncated) {
          let startPoint = locations[l] - entities.decode(comment.quotedFileContent.value).length;
          startPoint = startPoint < 0 ? 0 : startPoint;
          location[0] = startPoint;
        } else {
          const quotedComment = comment.quotedFileContent.value.replace(USER_REGEX, '');
          let startPoint = b.value.indexOf(entities.decode(quotedComment));
          startPoint = startPoint < 0 ? 0 : startPoint;
          location[0] = startPoint;
        }
      }

      return {
        id: comment.id,
        author: comment.author,
        text: marker.mark(comment.content),
        tags: comment.tags,
        published: comment.published,
        location: location,
      };
    }).filter(a => a);

    return b;
  });

  validateCommentRemoval(commentsRemoved, comments);

  return contents;
};

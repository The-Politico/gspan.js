import find from 'lodash/find';
import keys from 'lodash/keys';
import get from 'lodash/get';
import chalk from 'chalk';
import Marker from '../marker';
import parseRawComments from './parseRawComments';

const LINE_BREAKS = /\n|\r/g;
const KEY_VALUE_REGEX = /^([^\s]*)\s*:\s*((?:.|\s)*)$/;

const PUBLISH_REGEX = /^[p|P]ublish$/;
const UNPUBLISH_REGEX = /^[u|U]npublish$/;

export default (rawContent, meta, authors, authorNameAccessor, authorIdAccessor) => {
  const rawComments = parseRawComments(rawContent);
  if (!rawComments) {
    return {
      comments: [],
      activeAuthors: {},
    };
  }

  const activeAuthors = {};

  const comments = meta.map(c => {
    if (!c.quotedFileContent) {
      return null;
    }

    const commentKey = find(keys(rawComments), r => rawComments[r].replace(LINE_BREAKS, '') === c.content.replace(LINE_BREAKS, ''));

    if (commentKey === undefined) {
      console.warn(chalk.yellow(`⚠️ GSpan Warning: The following comment could not be mapped to document content: "${c.content}" ⚠️`));
    } else {
      c.pageKey = commentKey;
    }

    if (c.quotedFileContent.value.length > 600) {
      c.quotedFileContent.truncated = true;
    }

    if (authors) {
      const author = find(authors, a => get(a, authorNameAccessor, null) === c.author.displayName);
      if (!author) {
        console.warn(chalk.yellow(`⚠️ GSpan Warning: Could not find an author with the display name: "${c.author.displayName}" ⚠️`));
      }
      const id = get(author, authorIdAccessor, null);
      c.author = id;
      activeAuthors[id] = author;
    } else {
      activeAuthors[c.author.displayName] = c.author;
      c.author = c.author.displayName;
    }

    const marker = new Marker();
    c.tags = {};
    c.published = false;
    c.replies.forEach(r => {
      const matchKeyValue = KEY_VALUE_REGEX.exec(r.content);
      if (matchKeyValue) {
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
    activeAuthors,
  };
};

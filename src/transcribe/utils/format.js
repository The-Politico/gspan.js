import capitalize from 'lodash/capitalize';
import fs from 'fs';
import parseCsv from 'csv-parse/lib/sync';
import path from 'path';

const words = parseCsv(fs.readFileSync(path.join(__dirname, 'words.csv')));

export const formatText = str => {
  var ret = str.toLowerCase().replace('\r\n', ' '); // remove random line breaks
  ret = ret.trim(); // remove redundant spaces

  // now use our words file to do a bunch of stuff
  words.forEach((pair) => {
    ret = ret
      .replace(new RegExp(` ${pair[0].replace('.', '\\.')}( |\\.|,|:|')`, 'gi'), (match, a) => { return ` ${pair[1]}${a}`; })
      .replace(new RegExp(`^${pair[0]}( |\\.|,|:|')`, 'i'), (match, a) => { return `${pair[1]}${a}`; })
      .replace(new RegExp(` ${pair[0]}$`, 'i'), pair[1]);
  });

  const honorifics = [
    'sen',
    'rep',
    'mr',
    'mrs',
    'ms',
    'dr',
    'pres',
  ];

  const capitalizeHonorificsRegex = new RegExp(` (${honorifics.join('\\.?|')}\\.?) (\\w)`, 'gi');
  const speakerLineRegex = new RegExp(`(\\.|"|!|\\?|—)?\\s*((?:(?:${honorifics.join('|')})\\.)?[a-z ]{2,30}:)`, 'gi');

  ret = ret
    // Music notes
    .replace(/\s+b\x19\*\s+/, '\n\n🎵\n\n') //eslint-disable-line
    // remove blank space before puncuation
    .replace(/\s+(!|\?|;|:|,|\.|')/g, '$1')
    // handle honorifics
    .replace(capitalizeHonorificsRegex,
      (match, a, b) => { return ` ${capitalize(a)} ${b.toUpperCase()}`; })
    // Cap first letter of sentences
    .replace(/(!|\?|:|\.|>>)\s+(\w)/g, (match, a, b) => { return `${a} ${b.toUpperCase()}`; })
    // >> seems to be used instead of repeating speaker prompts in back and forths
    .replace(/\s*>>\s*/g, '\n\n>> ')
    // Put speaker prompts on new lines
    .replace(speakerLineRegex, '$1\n\n$2');

  return ret;
};

export const formatTranscript = (blob) => {
  // Transform soundbites to follow the same SRT format
  // [APPLAUSE] -> :[(APPLAUSE)] and a new paragraph break
  blob = blob.replace(/\[(.*?)\]\s*/g, '\n\n:[($1)]\n\n');
  // \n\n Seems to convey a change of speaker on CSPAN openedCaptions
  blob = blob.replace(/\n\n/g, '>>');
  // blob = blob.replace(/\[LB\]/g, '\n');

  var formattedParagraphs = blob.split('>>');
  // Ignore the empty initial in case it starts with a new paragraph
  if (!formattedParagraphs[0].length) formattedParagraphs.shift();
  formattedParagraphs = formattedParagraphs.filter(String);
  for (var i = 0; i < formattedParagraphs.length; i += 1) {
    formattedParagraphs[i] = formattedParagraphs[i].trim();
    // Make speakers uppercase to mimic SRT format
    formattedParagraphs[i] = formattedParagraphs[i].replace(/^([ A-Za-z0-9.-]{2,30}?:)/, function (v) { return '<' + v.toUpperCase().slice(0, -1) + '>:'; });
  }
  return formattedParagraphs;
};

export default words => formatTranscript(formatText(words));

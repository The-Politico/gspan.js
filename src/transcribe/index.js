import io from 'socket.io-client';
import { google } from '@politico/interactive-bin';
import { formatText, formatTranscript } from './utils/format';
import getWordsSince from './utils/getWordsSince';
import cleanCache from './utils/cleanCache';

const docsAPI = new google.Docs();

export const start = (doc, cache, callback, limit = null, timestamp, iteration = 0) => {
  const text = formatTranscript(formatText(getWordsSince(cache, timestamp)));
  if (text.length === 1) {
    if (/^<.*>:.*$/.test(text[0])) {
      docsAPI.append(doc, `\n\n${text[0]}`);
    } else {
      docsAPI.append(doc, ` ${text[0]}`);
    }
  } else if (text.length > 1) {
    docsAPI.append(doc, ` ${text.join('\n\n')}`);
  }

  const newTimestamp = Date.now();

  if (iteration !== limit) {
    setTimeout(() => { start(doc, cache, callback, limit, newTimestamp, iteration + 1); }, 2500);
  } else {
    callback();
  }
};

export default (doc, limit) => {
  // Where we stash our stuff
  let backup = null;
  try {
    backup = require(`${process.cwd()}/gspan-transcript-backup.json`);
  } catch (e) {}

  const cache = backup || [];

  // Setup a cache buster so our cache doesn't use all the memory
  const cacheCheckInterval = 5 * 60 * 1000; // 5 mins -> microseconds
  setInterval(() => { cleanCache(cache); }, cacheCheckInterval);

  const socket = io.connect('https://openedcaptions.com:443');
  socket.on('content', data => {
    if (data.data.body === '\r\n') { return; }
    const dat = {t: Date.now(), r: data.data.body};
    // console.log(dat.t, dat.r);
    cache.push(dat);
  });

  return new Promise(resolve => {
    const callback = () => {
      socket.disconnect();
      resolve(cache);
    };
    start(doc, cache, callback, limit);
  });
};

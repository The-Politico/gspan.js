import io from 'socket.io-client';
import fs from 'fs';
import { google } from '@politico/interactive-bin';
import { formatText, formatTranscript } from './utils/format';
import backupCache from './utils/backupCache';

const docsAPI = new google.Docs();

export const start = (doc, cache, callback, limit = null, timestamp, iteration = 0) => {
  const text = formatTranscript(formatText(cache.splice(0, cache.length).join(' ')));

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

export default async function (doc, limit, useBackup = false, verbose = false) {
  const cache = [];

  if (useBackup) {
    let backup = null;
    try {
      backup = fs.readFileSync('transcript.txt', 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);

      cache.push(backup);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = fs.createWriteStream('transcript.txt', {flags: 'a'});

  const socket = io.connect('https://openedcaptions.com:443');
  socket.on('content', data => {
    if (data.data.body === '\r\n') { return; }
    const dat = data.data.body;

    backupCache(backupStream, ` ${dat}`);

    if (verbose) {
      console.log(Date.now(), dat);
    }

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

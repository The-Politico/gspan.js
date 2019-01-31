import io from 'socket.io-client';
import fs from 'fs';
import { google } from '@politico/interactive-bin';
import { formatText, formatTranscript } from './utils/format';
import backupCache from './utils/backupCache';

const docsAPI = new google.Docs();

export default async function (doc, limit, fillBackup = false, backupName = 'transcript.txt', verbose = false) {
  const cache = [];

  if (fillBackup) {
    let backup = null;
    try {
      backup = fs.readFileSync(backupName, 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);

      cache.push(backup);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = fs.createWriteStream(backupName, {flags: 'a'});

  return new Promise(resolve => {
    const socket = io.connect('https://openedcaptions.com:443');
    let iter = 0;

    socket.on('content', data => {
      if (data.data.body === '\r\n') { return; }
      const dat = data.data.body;

      backupCache(backupStream, ` ${dat}`, backupName);

      if (verbose) {
        console.log(Date.now(), dat);
      }

      const text = formatTranscript(formatText(dat));

      if (text.length === 1) {
        if (/^<.*>:.*$/.test(text[0])) {
          docsAPI.append(doc, `\n\n${text[0]}`);
        } else {
          docsAPI.append(doc, ` ${text[0]}`);
        }
      } else if (text.length > 1) {
        docsAPI.append(doc, ` ${text.join('\n\n')}`);
      }

      iter++;
      if (limit && iter === limit) {
        resolve();
        socket.disconnect();
      }
    });
  });
};

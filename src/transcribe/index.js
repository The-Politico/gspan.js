import io from 'socket.io-client';
import fs from 'fs';
import assign from 'lodash/assign';
import { google } from '@politico/interactive-bin';
import format from './utils/format';
import backupCache from './utils/backupCache';
import writeToDoc from './utils/writeToDoc';
import getCache from './utils/getCache';

const docsAPI = new google.Docs();

export default async function (doc, options) {
  const defaults = {
    backfill: false,
    backupFile: 'transcript.txt',
    verbose: true,
    limit: null,
  };

  const config = assign({}, defaults, options);

  const cache = [];

  if (config.backfill) {
    let backup = null;
    try {
      backup = fs.readFileSync(config.backupFile, 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);

      const text = format(backup);
      writeToDoc(docsAPI, doc, text);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = fs.createWriteStream(config.backupFile, { flags: 'a' });

  return new Promise(resolve => {
    const socket = io.connect('https://openedcaptions.com:443');
    let iter = 0;
    let endedInPeriod = false;

    socket.on('content', data => {
      if (data.data.body === '\r\n') { return; }
      const dat = data.data.body;

      backupCache(backupStream, ` ${dat}`, config.backupFile);

      if (config.verbose) {
        console.log(Date.now(), dat);
      }

      let formatted = format(dat);
      if (endedInPeriod) {
        formatted = formatted.replace(/(\w)/, (a, b) => b.toUpperCase());
      }
      cache.push(formatted);

      if (formatted.match(/\.\s*$/)) {
        endedInPeriod = true;
      } else {
        endedInPeriod = false;
      }

      iter++;
      if (config.limit && iter === config.limit) {
        resolve();
        socket.disconnect();
      }
    });

    setInterval(() => {
      const text = getCache(cache);
      writeToDoc(docsAPI, doc, text);
    }, 2500);
  });
};

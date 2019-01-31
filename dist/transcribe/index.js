"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function (doc, limit, fillBackup = false, backupName = 'transcript.txt', verbose = false) {
  const cache = [];

  if (fillBackup) {
    let backup = null;

    try {
      backup = _fs2.default.readFileSync(backupName, 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);
      cache.push(backup);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = _fs2.default.createWriteStream(backupName, {
    flags: 'a'
  });

  return new Promise(resolve => {
    const socket = _socket2.default.connect('https://openedcaptions.com:443');

    let iter = 0;
    socket.on('content', data => {
      if (data.data.body === '\r\n') {
        return;
      }

      const dat = data.data.body;
      (0, _backupCache2.default)(backupStream, ` ${dat}`, backupName);

      if (verbose) {
        console.log(Date.now(), dat);
      }

      const text = (0, _format.formatTranscript)((0, _format.formatText)(dat));

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

var _socket = require("socket.io-client");

var _socket2 = _interopRequireDefault(_socket);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _interactiveBin = require("@politico/interactive-bin");

var _format = require("./utils/format");

var _backupCache = require("./utils/backupCache");

var _backupCache2 = _interopRequireDefault(_backupCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const docsAPI = new _interactiveBin.google.Docs();
;
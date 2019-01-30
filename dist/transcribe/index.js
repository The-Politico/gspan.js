"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = undefined;

exports.default = async function (doc, limit, useBackup = false, verbose = false) {
  const cache = [];

  if (useBackup) {
    let backup = null;

    try {
      backup = _fs2.default.readFileSync('transcript.txt', 'utf8');
      const d = new Date();
      d.setDate(d.getDate() - 100);
      cache.push(backup);
    } catch (e) {
      console.error(e);
    }
  }

  const backupStream = _fs2.default.createWriteStream('transcript.txt', {
    flags: 'a'
  });

  const socket = _socket2.default.connect('https://openedcaptions.com:443');

  socket.on('content', data => {
    if (data.data.body === '\r\n') {
      return;
    }

    const dat = data.data.body;
    (0, _backupCache2.default)(backupStream, ` ${dat}`);

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

const start = exports.start = (doc, cache, callback, limit = null, timestamp, iteration = 0) => {
  const text = (0, _format.formatTranscript)((0, _format.formatText)(cache.splice(0, cache.length).join(' ')));

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
    setTimeout(() => {
      start(doc, cache, callback, limit, newTimestamp, iteration + 1);
    }, 2500);
  } else {
    callback();
  }
};

;
#!/usr/bin/env node
"use strict";

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.help() // eslint-disable-line
.scriptName('gspan-transcribe').command('transcribe <doc>', 'Begins transcribing CSPAN into a document.', yargs => {
  yargs.positional('doc', {
    describe: 'The Google Doc ID',
    type: 'string'
  });
}, async function (argv) {
  await (0, _index2.default)(argv.doc, argv.limit, argv.backup, argv.verbose);
}).option('verbose', {
  alias: 'v',
  describe: 'Log new entries in the console',
  type: 'boolean'
}).option('backup', {
  alias: 'b',
  default: false,
  describe: 'Start from a saved backup file',
  type: 'boolean'
}).option('limit', {
  alias: 'l',
  describe: 'A limit of iterations.',
  type: 'number'
}).argv;
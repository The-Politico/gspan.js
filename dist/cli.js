#!/usr/bin/env node
"use strict";

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require("./parse/index");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./transcribe/index");

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default // eslint-disable-line
.help().scriptName('gspan') // Download / Parse
.command('download <doc> [directory]', 'Downloads a GSpan doc as a JSON file.', yargs => {
  yargs.positional('doc', {
    describe: 'The Google Doc ID',
    type: 'string'
  }).positional('directory', {
    describe: 'The directory to save the file to',
    type: 'string'
  }).option('authorAPI', {
    alias: 'a',
    describe: 'A link to an authors API',
    type: 'string'
  }).option('authorNameAccessor', {
    alias: 'n',
    describe: 'Accessor for Google display name',
    type: 'string'
  }).option('authorIdAccessor', {
    alias: 'i',
    describe: 'Accessor for unique ID',
    type: 'string'
  });
}, async function (argv) {
  const transcript = await (0, _index2.default)(argv.doc, argv.directory, argv);

  if (!argv.directory) {
    console.log(JSON.stringify(transcript));
  }
}) // Transcribe
.command('transcribe <doc>', 'Begins transcribing CSPAN into a document.', yargs => {
  yargs.positional('doc', {
    describe: 'The Google Doc ID',
    type: 'string'
  }).option('verbose', {
    alias: 'v',
    describe: 'Log new entries in the console',
    type: 'boolean'
  }).option('backfill', {
    alias: 'b',
    default: false,
    describe: 'Start from a saved backup file',
    type: 'boolean'
  }).option('backupFile', {
    alias: 'f',
    default: 'transcript.txt',
    describe: 'A path/filename to save a backup file',
    type: 'string'
  }).option('limit', {
    alias: 'l',
    describe: 'A limit of iterations.',
    type: 'number'
  });
}, async function (argv) {
  await (0, _index4.default)(argv.doc, argv.limit, argv.backfill, argv.backupFile, argv.verbose);
}).argv;
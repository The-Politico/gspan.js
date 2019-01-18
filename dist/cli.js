#!/usr/bin/env node
"use strict";

var _yargs = require("yargs");

var _yargs2 = _interopRequireDefault(_yargs);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_yargs2.default.help() // eslint-disable-line
.scriptName('gspan').command('download <doc> [directory]', 'Downloads a GSpan doc as a JSON file.', yargs => {
  yargs.positional('doc', {
    describe: 'The Google Doc ID',
    type: 'string'
  }).positional('directory', {
    describe: 'The directory to save the file to',
    type: 'string'
  });
}, async function (argv) {
  const transcript = await (0, _index2.default)(argv.doc, argv.directory, argv);

  if (!argv.directory) {
    console.log(JSON.stringify(transcript));
  }
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
}).argv;
"use strict";

var _index = require("../parse/index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.command = 'download <doc> [directory]';
exports.desc = 'Downloads a GSpan doc as a JSON file.';
exports.builder = {
  doc: {
    describe: 'The Google Doc ID',
    type: 'string'
  },
  directory: {
    describe: 'The directory to save the file to',
    type: 'string'
  },
  authorAPI: {
    alias: 'a',
    describe: 'A link to an authors API',
    type: 'string'
  },
  authorNameAccessor: {
    alias: 'n',
    describe: 'Accessor for Google display name',
    type: 'string'
  },
  authorIdAccessor: {
    alias: 'i',
    describe: 'Accessor for unique ID',
    type: 'string'
  }
};

exports.handler = async function (argv) {
  const transcript = await (0, _index2.default)(argv.doc, argv.directory, argv);

  if (!argv.directory) {
    console.log(JSON.stringify(transcript));
  }
};
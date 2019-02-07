"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function (fileId, directory, config = {}) {
  const drive = new _interactiveBin.google.Drive(); // get raw data

  const raw = await drive.export(fileId);
  const commentsMeta = await drive.comments(fileId);
  let authors;

  if (config.authorAPI) {
    authors = await (0, _nodeFetch2.default)(config.authorAPI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.GSPAN_STAFF_TOKEN}`
      }
    }).then(res => res.json());
  } // parse raw data into workable data structure


  const [transcriptRaw, footerRaw] = (0, _splitRaw2.default)(raw);
  const transcript = (0, _transcript2.default)(transcriptRaw);
  const {
    activeAuthors,
    comments
  } = (0, _comments2.default)(footerRaw, commentsMeta, authors, config.authorNameAccessor, config.authorIdAccessor, config.defaultPublish); // merge transcript and comments

  const content = (0, _mergeTranscriptComments2.default)(transcript, comments).map((c, idx, full) => (0, _makeID2.default)(c, idx, full));
  const output = {
    users: activeAuthors,
    content
  };

  if (directory) {
    return _fsExtra2.default.writeJson(directory, output);
  } else {
    return output;
  }
};

var _interactiveBin = require("@politico/interactive-bin");

var _nodeFetch = require("node-fetch");

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _transcript = require("./transcript");

var _transcript2 = _interopRequireDefault(_transcript);

var _comments = require("./comments");

var _comments2 = _interopRequireDefault(_comments);

var _splitRaw = require("./utils/splitRaw");

var _splitRaw2 = _interopRequireDefault(_splitRaw);

var _mergeTranscriptComments = require("./utils/mergeTranscriptComments");

var _mergeTranscriptComments2 = _interopRequireDefault(_mergeTranscriptComments);

var _makeID = require("./utils/makeID");

var _makeID2 = _interopRequireDefault(_makeID);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
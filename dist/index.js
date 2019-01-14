"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function (fileId) {
  const drive = new _interactiveBin.google.Drive();
  const raw = await drive.export(fileId);
  const [transcriptRaw, footerRaw] = (0, _splitRaw2.default)(raw);
  const transcript = (0, _parse2.default)(transcriptRaw);
  const footer = (0, _parse2.default)(footerRaw); // let files = [];
  // try {
  //   files = await drive.comments('1Pht8pQS_gF3Q78IeGSObDD3op9JjNGKd17p4q62Lwtw');
  // } catch (e) {
  //   console.error(e);
  // }
  // console.log(files);

  return transcript;
};

var _interactiveBin = require("@politico/interactive-bin");

var _parse = require("./parse");

var _parse2 = _interopRequireDefault(_parse);

var _splitRaw = require("./utils/splitRaw");

var _splitRaw2 = _interopRequireDefault(_splitRaw);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
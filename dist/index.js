"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = async function (fileId) {
  const drive = new _interactiveBin.google.Drive();
  const rawExport = await drive.export(fileId);
  let rawSection = rawExport.split('________________\r\n^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^');

  if (rawSection.length === 1) {
    rawSection = rawExport.split('________________\r\n-------> LIVE TRANSCRIPT HAS ENDED <-----------');
  }

  if (rawSection.length === 1) {
    return null;
  }

  const [transcriptRaw, footerRaw] = rawSection;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
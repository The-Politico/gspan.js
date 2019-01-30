"use strict";

var _transcribe = require("../transcribe/");

var _transcribe2 = _interopRequireDefault(_transcribe);

var _interactiveBin = require("@politico/interactive-bin");

var _expect = require("expect.js");

var _expect2 = _interopRequireDefault(_expect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';
describe('Gspan Transcribe', () => {
  it('Works', async function () {
    const cache = await (0, _transcribe2.default)(TEST_DOC, 5);
    const drive = new _interactiveBin.google.Drive();
    const text = await drive.export(TEST_DOC);
    (0, _expect2.default)(cache.length).to.be.greaterThan(0);
    cache.forEach(c => {
      (0, _expect2.default)(text.indexOf(c.r) > -1);
    });
  });
});
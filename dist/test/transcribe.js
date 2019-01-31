"use strict";

var _expect = require("expect.js");

var _expect2 = _interopRequireDefault(_expect);

var _transcribe = require("../transcribe/");

var _transcribe2 = _interopRequireDefault(_transcribe);

var _format = require("../transcribe/utils/format");

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';
describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await (0, _transcribe2.default)(TEST_DOC, 5);
  });
  it('Formats speakers at the start of an input', async function () {
    const speaker = (0, _format2.default)('MR. BRIZ: HELLO');
    (0, _expect2.default)(speaker).to.be.an('array');
    (0, _expect2.default)(speaker[0]).to.be('<MR. BRIZ>: Hello');
  });
  it('Formats speakers in the middle of an input', async function () {
    const speaker = (0, _format2.default)('END OF A SENTENCE. MR. BRIZ: HELLO');
    (0, _expect2.default)(speaker).to.be.an('array');
    (0, _expect2.default)(speaker[0]).to.be('end of a sentence.');
    (0, _expect2.default)(speaker[1]).to.be('<MR. BRIZ>: Hello');
  });
  it('Formats line breaks', async function () {
    const speaker = (0, _format2.default)('END OF A SENTENCE. >> ANOTHER PARAGRAPH.');
    (0, _expect2.default)(speaker).to.be.an('array');
    (0, _expect2.default)(speaker[0]).to.be('end of a sentence.');
    (0, _expect2.default)(speaker[1]).to.be('Another paragraph.');
  });
  it('Formats soundbites', async function () {
    const soundbiteSolo = (0, _format2.default)('[APPLAUSE]');
    (0, _expect2.default)(soundbiteSolo[0]).to.be(':[(applause)]');
    const soundbite = (0, _format2.default)('END OF A SENTENCE. [APPLAUSE] SOME MORE WORDS.');
    (0, _expect2.default)(soundbite).to.be.an('array');
    (0, _expect2.default)(soundbite[0]).to.be('end of a sentence.');
    (0, _expect2.default)(soundbite[1]).to.be(':[(applause)]');
    (0, _expect2.default)(soundbite[2]).to.be('some more words.');
  });
  it('Formats complex combinations', async function () {
    const soundbite = (0, _format2.default)('END OF A SENTENCE. [APPLAUSE] ANDREW BRIZ: SOME MORE WORDS.');
    (0, _expect2.default)(soundbite).to.be.an('array');
    (0, _expect2.default)(soundbite[0]).to.be('end of a sentence.');
    (0, _expect2.default)(soundbite[1]).to.be(':[(applause)]');
    (0, _expect2.default)(soundbite[2]).to.be('<ANDREW BRIZ>: Some more words.');
  });
});
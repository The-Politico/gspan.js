"use strict";

var _expect = require("expect.js");

var _expect2 = _interopRequireDefault(_expect);

var _transcribe = require("../transcribe/");

var _transcribe2 = _interopRequireDefault(_transcribe);

var _format = require("../transcribe/utils/format");

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_DOC = '1WazH8mGZUtMC0qOxh-BIsnmoAj9WwC25JEndUsb5lYc';
describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await (0, _transcribe2.default)(TEST_DOC, 5);
  });
  it('Formats ends of sentences.', async function () {
    const speaker = (0, _format2.default)('END OF A SENTENCE. SOME MORE WORDS');
    (0, _expect2.default)(speaker).to.be(' end of a sentence. Some more words');
  });
  it('Formats speakers at the start of an input', async function () {
    const speaker = (0, _format2.default)('MR. BRIZ: HELLO');
    (0, _expect2.default)(speaker).to.be('\n\n<MR. BRIZ>: Hello');
  });
  it('Formats speakers in the middle of an input', async function () {
    const speaker = (0, _format2.default)('END OF A SENTENCE. MR. BRIZ: HELLO');
    (0, _expect2.default)(speaker).to.be(' end of a sentence.\n\n<MR. BRIZ>: Hello');
  });
  it('Formats solo speakers', async function () {
    const soundbite = (0, _format2.default)('MR. BRIZ:');
    (0, _expect2.default)(soundbite).to.be('\n\n<MR. BRIZ>:');
  });
  it('Formats line breaks', async function () {
    const speaker = (0, _format2.default)('END OF A SENTENCE. >> ANOTHER PARAGRAPH.');
    (0, _expect2.default)(speaker).to.be(' end of a sentence.\n\nAnother paragraph.');
  });
  it('Formats soundbites', async function () {
    const soundbite = (0, _format2.default)('END OF A SENTENCE. [APPLAUSE] SOME MORE WORDS.');
    (0, _expect2.default)(soundbite).to.be(' end of a sentence.\n\n:[(applause)]\n\nsome more words.');
  });
  it('Formats solo soundbites', async function () {
    const soundbite = (0, _format2.default)('[APPLAUSE]');
    (0, _expect2.default)(soundbite).to.be('\n\n:[(applause)]');
  });
  it('Formats complex combinations', async function () {
    const soundbite = (0, _format2.default)('END OF A SENTENCE. [APPLAUSE] ANDREW BRIZ: SOME MORE WORDS.');
    (0, _expect2.default)(soundbite).to.be(' end of a sentence.\n\n:[(applause)]\n\n<ANDREW BRIZ>: Some more words.');
  });
});
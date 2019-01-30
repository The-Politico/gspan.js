"use strict";

var _transcribe = require("../transcribe/");

var _transcribe2 = _interopRequireDefault(_transcribe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';
describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await (0, _transcribe2.default)(TEST_DOC, 5);
  });
});
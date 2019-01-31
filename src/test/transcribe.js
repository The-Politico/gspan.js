import expect from 'expect.js';
import transcribe from '../transcribe/';
import format from '../transcribe/utils/format';

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';

describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await transcribe(TEST_DOC, 5);
  });

  it('Formats speakers at the start of an input', async function () {
    const speaker = format('MR. BRIZ: HELLO');
    expect(speaker).to.be.an('array');
    expect(speaker[0]).to.be('<MR. BRIZ>: Hello');
  });

  it('Formats speakers in the middle of an input', async function () {
    const speaker = format('END OF A SENTENCE. MR. BRIZ: HELLO');
    expect(speaker).to.be.an('array');
    expect(speaker[0]).to.be('end of a sentence.');
    expect(speaker[1]).to.be('<MR. BRIZ>: Hello');
  });

  it('Formats line breaks', async function () {
    const speaker = format('END OF A SENTENCE. >> ANOTHER PARAGRAPH.');
    expect(speaker).to.be.an('array');
    expect(speaker[0]).to.be('end of a sentence.');
    expect(speaker[1]).to.be('Another paragraph.');
  });

  it('Formats soundbites', async function () {
    const soundbiteSolo = format('[APPLAUSE]');
    expect(soundbiteSolo[0]).to.be(':[(applause)]');

    const soundbite = format('END OF A SENTENCE. [APPLAUSE] SOME MORE WORDS.');
    expect(soundbite).to.be.an('array');
    expect(soundbite[0]).to.be('end of a sentence.');
    expect(soundbite[1]).to.be(':[(applause)]');
    expect(soundbite[2]).to.be('some more words.');
  });

  it('Formats complex combinations', async function () {
    const soundbite = format('END OF A SENTENCE. [APPLAUSE] ANDREW BRIZ: SOME MORE WORDS.');
    expect(soundbite).to.be.an('array');
    expect(soundbite[0]).to.be('end of a sentence.');
    expect(soundbite[1]).to.be(':[(applause)]');
    expect(soundbite[2]).to.be('<ANDREW BRIZ>: Some more words.');
  });
});

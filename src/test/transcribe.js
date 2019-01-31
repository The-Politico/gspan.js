import expect from 'expect.js';
import transcribe from '../transcribe/';
import format from '../transcribe/utils/format';

const TEST_DOC = '1WazH8mGZUtMC0qOxh-BIsnmoAj9WwC25JEndUsb5lYc';

describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await transcribe(TEST_DOC, 5);
  });

  it('Formats speakers at the start of an input', async function () {
    const speaker = format('MR. BRIZ: HELLO');
    expect(speaker).to.be('\n\n<MR. BRIZ>: Hello');
  });

  it('Formats speakers in the middle of an input', async function () {
    const speaker = format('END OF A SENTENCE. MR. BRIZ: HELLO');
    expect(speaker).to.be(' end of a sentence.\n\n<MR. BRIZ>: Hello');
  });

  it('Formats solo speakers', async function () {
    const soundbite = format('MR. BRIZ:');
    expect(soundbite).to.be('\n\n<MR. BRIZ>:');
  });

  it('Formats line breaks', async function () {
    const speaker = format('END OF A SENTENCE. >> ANOTHER PARAGRAPH.');
    expect(speaker).to.be(' end of a sentence.\n\nAnother paragraph.');
  });

  it('Formats soundbites', async function () {
    const soundbite = format('END OF A SENTENCE. [APPLAUSE] SOME MORE WORDS.');
    expect(soundbite).to.be(' end of a sentence.\n\n:[(applause)]\n\nsome more words.');
  });

  it('Formats solo soundbites', async function () {
    const soundbite = format('[APPLAUSE]');
    expect(soundbite).to.be('\n\n:[(applause)]');
  });

  it('Formats complex combinations', async function () {
    const soundbite = format('END OF A SENTENCE. [APPLAUSE] ANDREW BRIZ: SOME MORE WORDS.');
    expect(soundbite).to.be(' end of a sentence.\n\n:[(applause)]\n\n<ANDREW BRIZ>: Some more words.');
  });
});

import transcribe from '../transcribe/';
import { google } from '@politico/interactive-bin';
import expect from 'expect.js';

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';

describe('Gspan Transcribe', () => {
  it('Works', async function () {
    const cache = await transcribe(TEST_DOC, 5);
    const drive = new google.Drive();
    const text = await drive.export(TEST_DOC);

    expect(cache.length).to.be.greaterThan(0);
    cache.forEach(c => {
      expect(text.indexOf(c.r) > -1);
    });
  });
});

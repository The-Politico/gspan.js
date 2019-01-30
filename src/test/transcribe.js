import transcribe from '../transcribe/';

const TEST_DOC = '1QF0A7FHe6-rf-_rIR4_kKSwJj5fg96IUvwQbQdpiFQw';

describe('Gspan Transcribe', () => {
  it('Works', async function () {
    await transcribe(TEST_DOC, 5);
  });
});

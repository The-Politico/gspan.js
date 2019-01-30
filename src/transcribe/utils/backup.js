import fs from 'fs-extra';

export default cache => {
  return fs.outputJSON('gspan-transcript-backup.json', cache);
};

import { google } from '@politico/interactive-bin';
import fetch from 'node-fetch';
import fs from 'fs-extra';
import parseTranscript from './transcript';
import parseComments from './comments';
import splitRaw from './utils/splitRaw';
import mergeTranscriptComments from './utils/mergeTranscriptComments';
import makeID from './utils/makeID';

export default async function (
  fileId,
  directory,
  config = {}
) {
  const drive = new google.Drive();

  // get raw data
  const raw = await drive.export(fileId);
  const commentsMeta = await drive.comments(fileId);

  let authors;
  if (config.authorAPI) {
    authors = await fetch(config.authorAPI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.GSPAN_STAFF_TOKEN}`,
      },
    }).then(res => res.json());
  }

  // parse raw data into workable data structure
  const [transcriptRaw, footerRaw] = splitRaw(raw);
  const transcript = parseTranscript(transcriptRaw);
  const {activeAuthors, comments} = parseComments(footerRaw, commentsMeta, authors, config.authorNameAccessor, config.authorIdAccessor, config.defaultPublish);

  // merge transcript and comments
  const content = mergeTranscriptComments(transcript, comments).map((c, idx, full) => makeID(c, idx, full));

  const output = {
    users: activeAuthors,
    content,
  };

  if (directory) {
    return fs.writeJson(directory, output);
  } else {
    return output;
  }
}

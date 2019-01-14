import { google } from '@politico/interactive-bin';
import parse from './parse';
import splitRaw from './utils/splitRaw';

export default async function (fileId) {
  const drive = new google.Drive();

  const raw = await drive.export(fileId);
  const [transcriptRaw, footerRaw] = splitRaw(raw);

  const transcript = parse(transcriptRaw);
  const footer = parse(footerRaw);

  // let files = [];
  // try {
  //   files = await drive.comments('1Pht8pQS_gF3Q78IeGSObDD3op9JjNGKd17p4q62Lwtw');
  // } catch (e) {
  //   console.error(e);
  // }

  // console.log(files);

  return transcript;
}

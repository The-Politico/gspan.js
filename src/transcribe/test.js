import { formatText, formatTranscript } from './utils/format';

// const words = 'MR. MEADOWS: MR. SPEAKER,';
const words = 'Thank you. MR. MEADOWS: MR. SPEAKER,';

console.log(formatText(words));
console.log('---');
console.log(formatTranscript(formatText(words)));

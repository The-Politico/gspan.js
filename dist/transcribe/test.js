"use strict";

var _format = require("./utils/format");

// const words = 'MR. MEADOWS: MR. SPEAKER,';
const words = 'Thank you. MR. MEADOWS: MR. SPEAKER,';
console.log((0, _format.formatText)(words));
console.log('---');
console.log((0, _format.formatTranscript)((0, _format.formatText)(words)));
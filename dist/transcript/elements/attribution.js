"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _content = require("./content");

var _content2 = _interopRequireDefault(_content);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'attribution',
  test: block => {
    const match = /^<(.*)>:(.*)$/.exec(block);

    if (match) {
      return {
        pass: true,
        value: {
          speaker: match[1],
          text: match[2]
        }
      };
    } else {
      return {
        pass: false
      };
    }
  },
  render: (value, block, output) => {
    const {
      speaker,
      text
    } = value;

    const spoken = _content2.default.render(text);

    const spokenWithAttribution = [{
      type: 'attribution',
      value: speaker
    }, spoken];
    const pastSpeakers = output.filter(o => o.type === 'attribution'); // if there are past speakers...

    if (pastSpeakers.length > 0) {
      const lastSpeaker = pastSpeakers[pastSpeakers.length - 1]; // if the last speaker is the same as the current speaker

      if (lastSpeaker.value === speaker) {
        return spoken;
      } else {
        // else if this is a new speaker...
        return spokenWithAttribution;
      }
    } else {
      // else if there are no speakers yet
      return spokenWithAttribution;
    }
  }
};
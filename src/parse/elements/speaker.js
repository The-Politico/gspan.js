import trim from 'lodash/trim';

export default {
  name: 'speaker',

  test: block => ({pass: true}),

  render: (text, block) => {
    if (text) {
      return {
        type: 'speaker',
        value: trim(text),
      };
    } else {
      const match = /^[\w|\d|\s]*:(.*)$/.exec(block);
      const spoken = match ? match[1] : block;
      return {
        type: 'speaker',
        value: trim(spoken),
      };
    }
  },
};

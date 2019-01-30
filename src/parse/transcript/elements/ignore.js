import includes from 'lodash/includes';

const IGNORE_BLOCKS = [
  '-------> LIVE TRANSCRIPT HAS ENDED <-----------',
  '^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^',
];

export default {
  name: 'ignore',

  test: block => {
    const isIgnorable = includes(IGNORE_BLOCKS, block);
    return {pass: isIgnorable};
  },

  render: () => null,
};

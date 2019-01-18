import splitRawFooter from './splitRawFooter';

export default raw => {
  let rawComments = splitRawFooter(raw);

  let output = {};
  const blocks = rawComments.split(/\n|\r/).filter(t => t !== '');

  let key = null;
  blocks.forEach(b => {
    const match = /^\[(\w+)\]+(.*)$/.exec(b);
    if (match) {
      key = match[1];
      output[key] = match[2];
    } else {
      output[key] = `${output[key]}\n${b}`;
    }
  });

  return output;
};

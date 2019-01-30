export default raw => {
  let output = raw.split('________________\r\n^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^');
  if (output.length === 1) {
    output = raw.split('________________\r\n-------> LIVE TRANSCRIPT HAS ENDED <-----------');
  }

  if (output.length === 1) {
    return [ null, null ];
  }

  return output;
};

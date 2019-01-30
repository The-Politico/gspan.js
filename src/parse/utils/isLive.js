export default raw => {
  if (raw.indexOf('^^^^^^^^^^ DO NOT WRITE BELOW THIS LINE ^^^^^^^^^^') > 0) {
    return true;
  }

  return false;
};

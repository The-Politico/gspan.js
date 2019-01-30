export default raw => {
  const rgx = /\n\[a\]\w/.exec(raw);
  const docEnd = rgx ? rgx.index : raw.length;

  return [
    raw.substring(0, docEnd),
    raw.substring(docEnd),
  ];
};

export default (client, doc, text) => {
  if (text.length === 1) {
    if (/^<.*>:.*$/.test(text[0])) {
      client.append(doc, `\n\n${text[0]}`);
    } else {
      client.append(doc, ` ${text[0]}`);
    }
  } else if (text.length > 1) {
    client.append(doc, ` ${text.join('\n\n')}`);
  }
};

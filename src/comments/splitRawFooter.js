export default raw => {
  const footerParts = raw.split('[a]');
  if (footerParts.length > 1) {
    return `[a]${footerParts[1]}`;
  } else {
    return null;
  }
};

export default (cache, timestamp) => {
  var ret = [];
  cache.forEach((val, i) => {
    if (val.t >= parseInt(timestamp)) {
      ret.push(val.r);
    }
  });
  return ret.join(' ');
};

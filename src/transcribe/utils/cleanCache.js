const ttl = 20 * 60 * 1000; // 20 mins -> microseconds

export default cache => {
  const ttlCheck = Date.now() - ttl;
  cache.forEach((val, i) => {
    if (val.t < ttlCheck) {
      delete cache[i];
    }
  });
};

import md5 from 'js-md5';

export default (block, idx, full) => {
  const unique = full.filter(f => f.value === block.value).length === 1;

  if (unique) {
    block.id = md5(block.value);
  } else {
    block.id = md5([block.value, idx]);
  }

  return block;
};

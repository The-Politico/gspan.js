import filter from 'lodash/filter';
import includes from 'lodash/includes';

export default arr => {
  return filter(arr, (val, i, iteratee) => includes(iteratee.map(i => i.content), val.content, i + 1));
};

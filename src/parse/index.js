import elements from './elements';

export default raw => {
  let output = [];

  const blocks = raw.split(/\n|\r/).filter(t => t !== '');

  blocks.forEach(b => {
    elements.some(e => {
      const { pass, value } = e.test(b);

      if (pass) {
        const render = e.render(value, b, output);
        if (render) {
          const addition = Array.isArray(render) ? render : [ render ];
          output = [...output, ...addition];
        }

        return true;
      }

      return false;
    });
  });

  return output;
};

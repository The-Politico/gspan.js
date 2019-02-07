import chalk from 'chalk';

export default (count, comments) => {
  if (comments.length === 0) { return; }

  const commentsOnPage = comments.filter(c => !c.resolved);

  const realCommentsCount = commentsOnPage.reduce((accumulator, currentValue, idx) => {
    // first iteration
    if (idx === 1) {
      return accumulator.replies.length + currentValue.replies.length + 2;
    } else {
      return accumulator + currentValue.replies.length + 1;
    }
  });

  if (realCommentsCount > count) {
    console.warn(chalk.yellow(
      `⚠️ GSpan Warning: Something went wrong. Not enough comment footnotes were removed from the page. ⚠️`
    ));
  } else if (realCommentsCount < count) {
    console.warn(chalk.yellow(
      `⚠️ GSpan Warning: Something went wrong. Too many comment footnotes were removed from the page. ⚠️`
    ));
  }
};

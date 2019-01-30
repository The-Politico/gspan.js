#!/usr/bin/env node
import yargs from 'yargs';
import transcribe from './index';

yargs.help() // eslint-disable-line
  .scriptName('gspan-transcribe')
  .command('transcribe <doc>', 'Begins transcribing CSPAN into a document.', (yargs) => {
    yargs
      .positional('doc', {
        describe: 'The Google Doc ID',
        type: 'string',
      });
  }, async function (argv) {
    await transcribe(argv.doc);
  })
  .argv;

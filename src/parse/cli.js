#!/usr/bin/env node
import yargs from 'yargs';
import parse from './index';

yargs.help() // eslint-disable-line
  .scriptName('gspan-parse')
  .command('download <doc> [directory]', 'Downloads a GSpan doc as a JSON file.', (yargs) => {
    yargs
      .positional('doc', {
        describe: 'The Google Doc ID',
        type: 'string',
      })
      .positional('directory', {
        describe: 'The directory to save the file to',
        type: 'string',
      });
  }, async function (argv) {
    const transcript = await parse(argv.doc, argv.directory, argv);
    if (!argv.directory) {
      console.log(JSON.stringify(transcript));
    }
  })
  .option('authorAPI', {
    alias: 'a',
    describe: 'A link to an authors API',
    type: 'string',
  })
  .option('authorNameAccessor', {
    alias: 'n',
    describe: 'Accessor for Google display name',
    type: 'string',
  })
  .option('authorIdAccessor', {
    alias: 'i',
    describe: 'Accessor for unique ID',
    type: 'string',
  })
  .argv;

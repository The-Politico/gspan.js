# Transcribing To A Doc

A main features of GSpan is its ability to transcribe live C-Span captions into a Google Doc that can then be parsed using it's [downloading functionality](DownloadingADoc.md).

There's a few ways GSpan can transcribe captions to a Google Doc:

- [As A Globally-Installed CLI](#as-a-globally-installed-cli)
- [As An NPM Script In A Package](#as-an-npm-script-in-a-package)
- [As An API Inside Node.js](#as-an-api-inside-node.js)

First though, let's go over the things each method has in common: it's arguments. Take a quick look at the table below and reference it as you go throughout the rest of this doc.


## GSpan Download Arguments Quick Reference

| Name | Description | Type | Required / Default | CLI Position / Alias |
| ---|---| ---|
| `doc` | The Google Doc's ID | String | **Required** | First
| `verbose` | Log new data from opened captions in the console | Boolean | true | -v
| `backfill`*| Start the transcribing from the latest saved backup file  | Boolean | false | -b |
| `backupFile`* | A filepath for the backup file | String | "transcript.txt" | -f |

<em>* Because Google Docs can be edited by many users, GSpan comes with a built-in backup system. [Read more about this system below](#creating-and-using-backups).</em>

## As A Globally-Installed CLI
If you've installed GSpan as a global package you can use it as a CLI from any directory in your terminal using:

```
$ gspan transcribe <doc>
```

Note that this will create a backup file called `transcript.txt` in your `pwd`.

You can also supply the other arguments using their aliases or names:

```
$ gspan transcribe MY_DOC_ID -v=false --backupFile="backup.txt"
```

## As An NPM Script In A Package
If you've installed GSpan as a package in a node project you can use the CLI in your node scripts like this:

```javascript
// package.json
{
  ...

  "scripts": {
    "transcribe": "gspan transcribe <doc>"
  }

  ...
}
```

And then run the download with:

```
$ npm run transcribe
```

This will create the backup file at the root of your project.

## As An API Inside Node.js
If you have GSpan installed in the node runtime you're using you can import GSpan and run its `download` function.

If a directory is provided it will return a promise which resolves when the file has been saved. If no directory is provided, it will return a promise which resolves with the GSpan data.

```javascript
import gspan from 'gspan';

gspan.transcribe('GOOGLE_DOC_ID');

```

Arguments other than `doc` can be supplied using the function's second argument. It should be an object with keys matching the names of the options.

```javascript
import gspan from 'gspan';

gspan.transcribe(
  'GOOGLE_DOC_ID',
  {
    verbose: false,
    backupFile: 'backup.txt'
  }
);

```

## Creating and Using Backups
By default, GSpan will create a backup file named `transcript.txt` in the [cwd](https://nodejs.org/api/process.html#process_process_cwd) of where it was called. The location of this file can be changed using the `backupFile` argument.

Content will continue to be appended to this backup file until it is manually cleared. If the contents of your Google Doc has been deleted and you cannot recover it (or you'd like to begin transcribing in a new Google doc) you can begin the transcription with the contents of the backup file by using the `backfill` argument.

#### Example

For example, the following content was captured from opened captions:

```
1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
```

Then you stop the transcription, and start transcription with a new `doc` ID and set `backfill` to `true`. And the following content is captured from opened captions:

```
4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

The Google Doc will now have the following combined content in it:

```
1. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
2. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
3. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
4. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
```

# GSpan.js

A tool for writing live C-Span transcripts into a Google Doc and annotating those docs in the same environment. It comes in two flavors: a CLI and a Node.js API which can be used directly in Node.js runtime.

GSpan uses [Opened Captions](https://openedcaptions.com/) created by [Dan Schultz](https://twitter.com/slifty) as the source of these captions. You can [read more about the Opened Captions project on Source](https://source.opennews.org/articles/introducing-opened-captions/).


## Quick Start

Install the package globally to use the CLI

```
$ npm install -g gspan
```

##### Transcribing from C-Span into a Google Doc

```
gspan transcribe <doc>

Begins transcribing CSPAN into a document.

Positionals:
  doc  The Google Doc ID                                     [string] [required]

Options:
  --verbose, -v     Log new entries in the console                     [boolean]
  --backfill, -b    Start from a saved backup file                     [boolean]
  --backupFile, -f  A filepath to save a backup                         [string]
  --limit, -l       A limit of iterations.                              [number]
```

#### Downloading and parsing data from a Google Doc

```
gspan download <doc> [output]

Downloads a GSpan doc as a JSON file.

Positionals:
  doc     The Google Doc ID                                  [string] [required]
  output  The directory to save the file to                             [string]

Options:
  --authorAPI, -a           A link to an authors API                    [string]
  --authorNameAccessor, -n  Accessor for Google display name            [string]
  --authorIdAccessor, -i    Accessor for unique ID                      [string]
  --defaultPublish, -p      Default for annoation published state      [boolean]
```

<em>* Boolean arguments can be set to false by setting them equal to false or by adding the `no-` prefix to their name. (e.g. `gspan transcribe DOC_ID --no-verbose` or `gspan download DOC_ID -p=false`)</em>


## Setup

In order to use this app you'll need a Google Service Account which has viewing access to your Google Doc. For help with creating a Google Service Account, see [Making A Google Service Account](docs/GoogleServiceAccount.md).

Once you have your credentials file, you'll need the `client_email` and `private_key`. You'll need to make sure that these are saved as environment variables in your runtime under the keys of `GAPI_CLIENT_EMAIL` and `GAPI_PRIVATE_KEY` respectively.

There's a number of ways to do this depending on your workflow. If you've never worked with environment variables in node check out [this guide](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html).

## API Documentation
- [Transcribing To A Doc](docs/TranscribingToADoc.md): API reference for GSpan transcribe.
- [Downloading A Doc](docs/DownloadingADoc.md): API reference for GSpan download.
- [The Data Signature](docs/DataSignature.md): API Reference for the output of GSpan download.

## Guides

- [Annotating Docs](docs/AnnotatingDocs.md): A guide to making the annotations in a Google Doc. This guide is meant for any audience regardless of technical proficiency so feel free to send it to your users.
- [Formatting Comments](docs/FormattingComments.md): A guide to formatting rich text annoations and the markdown output they produce. This guide is meant for developers.
- [Making A Google Service Account](docs/GoogleServiceAccount.md): A guide to setting up a Google service account and getting your credentials. This guide is meant for developers.

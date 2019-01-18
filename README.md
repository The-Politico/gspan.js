# GSpan.js

A script that downloads an [anno-docs](https://github.com/nprapps/anno-docs)-formatted Google Doc and translates it into JSON – using JavaScript. It also uses native Google Comments for annotations instead of the syntax created from `anno-docs` annotations. It comes in two flavors: a CLI and a Node.js API which can be used directly in Node.js runtime.

## Quickstart

Download GSpan inside a node project using `npm`:

```
$ npm install gspan
```

OR... you can use `yarn`:

```
$ yarn add gspan
```

OR... you can install it globally

```
$ npm install -g gspan
```

In order to use this app you'll need a Google Service Account which has viewing access to your Google Doc. For help with creating a Google Service Account, see [Making A Google Service Account](#making-a-google-service-account) below.

Once you have your credentials file, you'll need the `client_email` and `private_key`. You'll need to make sure that these are saved as environment variables in your runtime under the keys of `GAPI_CLIENT_EMAIL` and `GAPI_PRIVATE_KEY` respectively.

There's a number of ways to do this depending on your workflow. If you've never worked with environment variables in node check out [this guide](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html).

## Usage

No matter how you use it, GSpan has the following arguments:
1. `doc`\*: The Google Doc ID of an anno-docs-formatted Google Doc.
2. `directory`: The output directory for the GSpan data. Provide a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value to instead have the function return the data as a JSON object.
3. `options`: More options.

  <em>\*required</em>

The options currently available are for using GSpan with an external authors API. See [Connecting to An External Authors API](#connecting-to-an-external-authors-api) for more.

How to supply these arguments depends on the context you're using it is.

### Using As A Globally-Installed CLI
If you've installed GSpan as a global package you can use it as a CLI from any directory in your terminal using:

```
$ gspan download <doc> [directory]
```

Not providing a `directory` will log the output to the console. This can be used to pipe the result into another file or another command.

### Using As A Package-Installed CLI
If you've installed GSpan as a package in a node project you can use it in your node scripts like this:

```json
{
  ...

  "scripts": {
    "gspan": "gspan download <doc> [directory]"
  }

  ...
}
```

Or use it from the terminal like this:
```
$ npx gspan download <doc> [directory]
```

### Using As An API Inside Node.js
If you have it installed in the node runtime you're using you can import the function and run it.

If a directory is provided it will return a promise which resolves when the file has been saved. If no directory is provided, it will return a promise which resolves with the gspan data.

```javascript
import gspan from 'gspan';

/* Without an output directory */
gspan('GOOGLE_DOC_ID').then(data => {
  // do something with data
})

/***************************/

/* With an output directory */
gspan('GOOGLE_DOC_ID', 'gspan.json').then(() => {
  // the file is now saved...
})

```

## The Data

The data returned will look like this:

```json
{
  "live": false,
  "users": {
    "Andrew Briz": {
      "kind": "drive#user",
      "displayName": "Andrew Briz",
      "photoLink": "//lh3.googleusercontent.com/a-/AAuE7mBO9mjHMIvQ0Ja4mXCbm1r3R5Sl66FyCT-arfkWCg=s96-k-no",
      "me": false
    }
  },
  "content": [
    {
      "type": "attribution",
      "value": "SPEAKER 1",
      "annotations": []
    },
    {
      "type": "content",
      "value": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "annotations": [
        {
          "id": "AAAACewA71Q",
          "author": "Andrew Briz",
          "text": "Test",
          "tags": {
            "key": "value",
            "markdown": "**test** hello *test*"
          },
          "published": true,
          "location": [
            0,
            124
          ]
        },
        {
          "id": "AAAACewA78c",
          "author": "Andrew Briz",
          "text": "Unpublished comment",
          "tags": {},
          "published": false,
          "location": [
            392,
            409
          ]
        }
      ]
    },
    {
      "type": "soundbite",
      "value": "(applause)",
      "annotations": []
    },
    {
      "type": "attribution",
      "value": "SPEAKER 2",
      "annotations": []
    },
    {
      "type": "content",
      "value": "Duis ac elit ut massa vehicula condimentum. Proin posuere massa sed dapibus varius. Suspendisse aliquet aliquam lectus. Cras quis leo neque. Vestibulum tristique consectetur enim, vel semper ligula ullamcorper auctor. Praesent rutrum metus quis efficitur posuere. Sed eros massa, tempus a luctus eu, feugiat vel nisl.",
      "annotations": [
        {
          "id": "AAAACewA7zA",
          "author": "Andrew Briz",
          "text": "Draft comment",
          "tags": {},
          "published": false,
          "location": [
            120,
            140
          ]
        }
      ]
    }
  ]
}
```

At the top level, `live` will be set to `false` by default. It will be set to `true` if the anno-docs script is currently running. `users` is an object with unique IDs of all the active users referenced in the annotations. `content` is an array of content objects with a `type`, a `value`, and `annotations` which are comments made about the content object.

Annotations is an array of `comments` made about that content in the Google Doc. They have a `text` key which is the value of the comment. These will be parsed using a custom text parser that recognizes Google Doc styling syntax (* for bold, _ for italics).

These annotations have `publish` set to `false` unless someone replies to that comment with the word `publish` in the Google Doc. They can be set back to `false` by deleting that reply or by replying `unpublish`. The last `publish`/`unpublish` replied will be respected.

Users can also reply with a `key: value` syntax to create a set of `tags` for that annotations.

The location of the highlighted text is available in the `location` array. The first value of this array is the position where the highlight starts. First character is at index 0. The second value is the position (up to, but not including) where to end the highlight.

Because of caching on Google's end there is the possibility that the highlights don't match up perfectly if the text was changed after the comment was made. For this reason we've included a special syntax for overriding the highlighted area in the text of the Google Doc. Wrapping a commented section with `{{` `}}` tags will make that the location.

Finally, author is an ID that will match with the `users` object.

##### IMPORTANT
One thing to know is that Google uses the syntax of `[a]` to denote the locations of comments in your Google Doc. If you need to use the syntax of a single word inside square brackets, it should be escaped as so `\[a]` so as to be treated as real text. If something goes wrong GSpan will warn that too many comment footnotes were removed from the page. This is probably why.

## Connecting to An External Authors API
Unfortunately Google's API does not provide much data on commenters. For that GSpan has a way to connect to an external Author API as long as the data in that App has a display name that matches up with their Google Plus display name.

### Configuring Your Authors API
Your API should return an array that looks something like this:

```json
[
  {
    "id": "ezbwzhvrcw",
    "displayName": "Andrew Briz",
    "otherKey": "value",
    "otherKeyTwo": "value"
  },
  {
    "id": "ihgkgdchol",
    "displayName": "Jon McClure",
    "otherKey": "value",
    "otherKeyTwo": "value"
  },
]
```

Then in the options you'll need to provide the following three properties:
- `authorAPI`: The link to the API.
- `authorNameAccessor`: A [Lodash accessor](https://lodash.com/docs/4.17.11#get) that points to the key in your data that should match with Google's display name.
- `authorIdAccessor`: A Lodash accessor that points to a property unique for each author.

These options can be provided to the CLI as named arguments or using the `-a`, `-n`, and `-i` aliases respectively.

Using the example API above, you could run GSpan like this:

```
$ gspan download GOOGLE_DOC_ID data.json -a https://example.com/staff/ -n displayName -i id
```

or

```javascript
import gspan from 'gspan';

gspan('GOOGLE_DOC_ID', {
  authorAPI: "https://example.com/staff/",
  authorNameAccessor: "displayName",
  authorIdAccessor: "id"
}).then(data => {
  // do something with data
})
```

Which will create data that looks like:

```json
{
  "live": false,
  "users": {
    "ezbwzhvrcw": {
      "id": "ezbwzhvrcw",
      "displayName": "Andrew Briz",
      "otherKey": "value",
      "otherKeyTwo": "value"
    }
  },
  "content": [
    {
      "type": "content",
      "value": "Lorem ipsum dolor sit amet.",
      "annotations": [
        {
          "id": "AAAACewA71Q",
          "author": "ezbwzhvrcw",
          "text": "Test",
          "tags": {},
          "published": true,
          "location": [
            0,
            5
          ]
        }
      ]
    }
  ]
}
```

## Making A Google Service Account
In order to use this app, you're going to need to set up a service account in the Google API. This account will serve to handle permissions for individual files. Think of it as the Gmail account for a bot that runs this API. Want that bot to have access to a spreadsheet? Share it with it. Want it to have access to a whole directory of Spreadsheets automatically? You can share the directory with the bot too, and any spreadsheets made in it will be automatically shared.

To make a new service account, first you'll need a project in the developer console.
- Go to [the developer console](https://console.developers.google.com/iam-admin/iam).
- At the top header, you should see a dropdown to select a project. Choose one to go to its admin, or make a new one.
- Click the hamburger menu on the top left, hover over `API & Services`, and click `Library`.
- Search for the `Google Drive API` and click it.
- Click `Enable`
- Click the hamburger menu on the top left, hover over `IAM & admin`, and click `Service accounts`.
- Click `Create Service Account`.
- Give it a name and click `Create`
- Give it the role of `Editor` and click `Continue`.
- Click `Create Key` to get a one-time credentials file which you'll need to configure this app.

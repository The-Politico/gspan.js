# Downloading A Parsed Doc

One of the main features of GSpan is its ability to download a specially formatted Google Doc, parse it for annotations, and export the result as JSON.

## Downloading Data From A Google Doc

There's a few ways GSpan can download data from a Google Doc:

- [As A Globally-Installed CLI](#as-a-globally-installed-cli)
- [As An NPM Script In A Package](#as-an-npm-script-in-a-package)
- [As An API Inside Node.js](#as-an-api-inside-node.js)

First though, let's go over the things each method has in common: it's arguments. Take a quick look at the table below and reference it as you go throughout the rest of this doc.

### GSpan Download Arguments Quick Reference

| Name | Description | Type | Required / Default | CLI Position / Alias |
| ---|---| ---|
| `doc` | The Google Doc's ID | String | **Required** | First
| `output` | The output directory for the GSpan data. Provide a [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) value to instead have the function return the data as a JSON object | String | None | Second
| `defaultPublish`| The default value each annotation's publish key should be set to if there is no `publish` or `unpublish` reply  | Boolean | true | -p |
| `authorAPI`* | A link to an external authors API | String (URL) | None | -a
| `authorNameAccessor`* | A [Lodash accessor](https://lodash.com/docs/4.17.11#get) that points to the key in your data that should match with Google's display name | String | "displayName" | -n |
| `authorIdAccessor`* | A Lodash accessor that points to a property unique for each author | String | "displayName" | -i |

<em>* Google's native Author system doesn't provide more than a name and a Google profile photo. To make up for this shortcoming, GSpan's authors are configurable using these three arguments. See [Connecting to An External Authors API](#connecting-to-an-external-authors-api) for more.</em>

## As A Globally-Installed CLI
If you've installed GSpan as a global package you can use it as a CLI from any directory in your terminal using:

```
$ gspan download <doc> [output]
```

Not providing a `output` will log the output to the console. This can be used to pipe the result into another file or another command:

```
$ gspan download MY_DOC_ID > data.json
```

You can also supply the other arguments using their aliases or names:

```
$ gspan download MY_DOC_ID -p=false --authorAPI="https://example.com/staff/"
```


## As An NPM Script In A Package
If you've installed GSpan as a package in a node project you can use the CLI in your node scripts like this:

```javascript
// package.json
{
  ...

  "scripts": {
    "download": "gspan download <doc> [output]"
  }

  ...
}
```

And then run the download with:

```
$ npm run download
```

Just like with the global CLI you can choose to omit the `output` argument or provide extra arguments with their names or aliases. For more on creating npm scripts check out [the official docs.](https://docs.npmjs.com/misc/scripts)

## As An API Inside Node.js
If you have it installed in the node runtime you're using you can import Gspan and run its `download` function.

If a directory is provided it will return a promise which resolves when the file has been saved. If no directory is provided, it will return a promise which resolves with the Gspan data.

```javascript
import gspan from 'gspan';

/* Without an output directory */
gspan.download('GOOGLE_DOC_ID').then(data => {
  // do something with data
});

/***************************/

/* With an output directory */
gspan.download('GOOGLE_DOC_ID', 'FILEPATH').then(() => {
  // the file is now saved...
});

```

Arguments other than `doc` and `output` can be supplied using the function's third argument. It should be an object with keys matching the names of the options.

```javascript
import gspan from 'gspan';

gspan.download('GOOGLE_DOC_ID', null,
  {
    defaultPublish: false,
    authorAPI: 'https://example.com/staff/'
  }).then(data => {
  // do something with data
});

```

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

Using the example API above, you could run GSpan like this:

```
$ gspan download GOOGLE_DOC_ID data.json -a "https://example.com/staff/" -n displayName -i id
```

or

```javascript
import gspan from 'gspan';

gspan.download('GOOGLE_DOC_ID', null, {
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

# Formatting Comments

GSpan uses a unique form of formatting rich text which stems from our work with Slack chats. This format will apply to all comment text / tags and outputs standard markdown in the downloaded data.

## Bold

To make text bold, wrap it in asterisks (`*`).

##### In Google...
```
... some *bold* text ...
```

##### In The Data...
```
... some **bold** text ...
```

## Italics

To make text italic, wrap it in underscores (`_`).

##### In Google...
```
... some _italic_ text ...
```

##### In The Data...
```
... some *italic* text ...
```

## Basic Links

To create a hyperlink simply paste it.

##### In Google...
```
... http://example.com ...
```

##### In The Data...
```
... [http://example.com](http://example.com) ...
```

## Text Links

To create linked text wrap the display text in square brackets (`[]`) and paste the link immediately following the link (no space in between).

##### In Google...
```
... this is [a link]http://example.com ...
```

##### In The Data...
```
... this is [a link](http://example.com) ...
```

If your link requires punctuations that may be interpreted as part of the link, make sure to include it inside the square brackets and not immediately following the link.

✅ `[A link.]http://example.com` → `[A link](http://example.com)`

❌ `[A link]http://example.com.` → `[A link](http://example.com.)`

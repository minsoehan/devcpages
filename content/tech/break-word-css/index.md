+++
date = '2025-09-12T14:07:42+06:30'
draft = false
title = 'CSS overflow-wrap: break-word'
categories = ['tech', 'web']
tags = ['css', 'stylesheet']
+++

When designing for the web, one small but important detail is how browsers handle very long words or strings of text. On mobile screens especially, an unbroken word can stretch beyond the viewport and cause horizontal scrolling — something no user enjoys.

The modern solution is simple: add this to your stylesheet:

```css
body {
  overflow-wrap: break-word;
}
```

With this rule in place, the browser can gracefully break long words when needed, ensuring text always stays inside the screen width.

You may come across `word-break: break-word;` in older code samples, but this value is now considered deprecated. The CSS specification recommends `overflow-wrap: break-word;` instead, and it has excellent browser support.

A single line of CSS can save your layout, especially on smaller screens.

See:  
https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap  
https://developer.mozilla.org/en-US/docs/Web/CSS/word-break

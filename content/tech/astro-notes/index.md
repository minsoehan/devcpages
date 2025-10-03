+++
date = '2025-10-02T15:23:30+06:30'
draft = false
title = 'Astro Notes'
description = 'Notes of Astro web framework.'
categories = ['tech', 'web']
tag = ['astro', 'dev']
[params.add]
    codeblock = true
+++

### JSON import type errors

When we do:

```ts {text="index.astro"}
import mpps from "../../../content/members/documents/pps-myan/pps-myan.json";
import epps from "../../../content/members/documents/pps-eng/pps-eng.json";
```

VSCode/TS will show red underlines because:

- By default, TypeScript doesn’t always know how to type `*.json` imports.
- Unless you have `"resolveJsonModule": true` in your `tsconfig.json`, VSCode/TS will complain (red underline), even though Astro’s bundler (Vite) will run it fine.

Fix:

```json {text="tsconfig.json"}
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

### Combining Layouts, Astro and Md {class="mt3rem"}

You may want unify them into a single layout by detecting whether the props come from `*.astro`, an astro page or `*.md`, a Markdown/MDX page.

The difference is only in how frontmatter is passed, so you can normalize it inside the layout. For example:

```ts {text="AtMdLayout.astro"}
---
const props = Astro.props;

// Normalize frontmatter
let frontmatter;
if ("frontmatter" in props) {
  // Markdown/MDX page
  frontmatter = props.frontmatter;
} else {
  // Astro page
  frontmatter = props;
}

const { title, description, pubDate } = frontmatter;
const d = pubDate instanceof Date ? pubDate : new Date(pubDate);
---
<html lang="en">
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
    <footer>
      <small>Published {d.toDateString()}</small>
    </footer>
  </body>
</html>
```

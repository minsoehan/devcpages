+++
date = '2025-09-14T13:20:43+06:30'
draft = false
title = 'Astro Blog Build'
categories = ['tech', 'web']
tag = ['cloudflare', 'astro']
[params.add]
    codeblock = true
    filetree = true
+++

This is personal record for building a blog site using Astro web framework with Cloudflare integration. Consult with this pages: https://docs.astro.build/ and https://codeberg.org/minsoehan/cloudflare-astro-blog-sample for more details.

#### Create Cloudflare Worker with Astro Framework

```text {text="terminal command"}
npm create cloudflare@latest -- project-name --framework=astro
```

When you run this command, C3 creates a new project directory, initiates [Astro's official setup tool](https://docs.astro.build/en/tutorial/1-setup/2/), select **empty template** there, and configures the project for Cloudflare. It then offers the option to instantly deploy your application to Cloudflare.

#### Building Astro

Go into the `project-name` folder that was created by the previous command, and build the following directories structure.

- public
    - favicon
    - fonts
        - awesome
        - google
            - dancing-script
    - images
        - site-logo.png
- src
    - assets
        - images
            - default-photo.png
    - components
        - AsideCompo.astro
        - FooterCompo.astro
        - HeadCompo.astro
        - HeaderCompo.astro
        - HeaderLinkCompo.astro
        - HomeCompo.astro
        - MainCompo.astro
        - TimeCompo.astro
    - content
        - posts
    - layouts
        - BaseLayout.astro
        - MarkdownLayout.astro
    - pages
        - posts
    - scripts
        - header.js
    - styles
        - global.css
{class="file-tree"}

To build above directories and files structure, it is recommended to follow this order:

1. create directories and put your static contents in `/public` directory
2. create directories and put your static contents in `/src/assets` directory
3. add `site: "https://yoursitedomain.com",` in `astro.config.mjs` file:

```js {text="astro.config.mjs"}
...
export default defineConfig({
    site: "https://yoursitedomain.com/",
    ...
});
```
4. add `"strictNullChecks": true,` in the section of `"compilerOptions"` of `tsconfig.json` file:

```js {text="tsconfig.json"}
...
"compilerOptions": {
    "strictNullChecks": true,
    ...
}
```
5. create `src/content.config.ts` file with the following content:

```js {text="src/content.config.ts"}
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders'; // Not available with legacy API

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        heroImage: image().optional()
  }),
});

export const collections = { posts };
```
6. create `src/components/HeadCompo.astro` with the following content:

```ts {text="src/components/HeadCompo.astro"}
---
import "../styles/global.css";
import type { ImageMetadata } from "astro";
import FallbackImage from "../assets/images/vlca-factory.jpg";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
interface Props {
    title: string;
    description: string;
    image?: ImageMetadata;
}
const { title, description, image = FallbackImage } = Astro.props;
const fullTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE;
const fullDescription = description ? `${description} ${SITE_DESCRIPTION}` : SITE_DESCRIPTION;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{fullTitle}</title>
<meta name="description" content={fullDescription}>

<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
<link rel="shortcut icon" href="/favicon/favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
<link rel="manifest" href="/favicon/site.webmanifest" />

<link rel="sitemap" href="/sitemap-index.xml" />
<link
	rel="alternate"
	type="application/rss+xml"
	title={SITE_TITLE}
	href={new URL('rss.xml', Astro.site)}
/>
<meta name="generator" content={Astro.generator} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content={Astro.url} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image.src, Astro.url)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={Astro.url} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={new URL(image.src, Astro.url)} />
```
7. create `src/components/HeaderLink.astro` with the following content:

```ts {text="src/components/HeaderLink.astro"}
---
import type { HTMLAttributes } from 'astro/types';

type Props = HTMLAttributes<'a'>;

const { href, class: className, ...props } = Astro.props;
const pathname = Astro.url.pathname.replace(import.meta.env.BASE_URL, '');
const subpath = pathname.match(/[^\/]+/g);
const isActive = href === pathname || href === '/' + (subpath?.[0] || '');
---

<a href={href} class:list={[className, { active: isActive }]} {...props}>
	<slot />
</a>
```
8. create two files, `src/pages/posts/index.astro` and `src/pages/posts/[...slug].astro` with the following contents:

```ts {text="src/pages/posts/index.astro"}
---
import { Image } from "astro:assets";
import { getCollection } from "astro:content";
import Layout from "../../layouts/BaseLayout.astro";
import BlogBody from "../../components/MainCompo.astro";
import Date from "../../components/TimeCompo.astro";
const { title, description } = Astro.props;
const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
---

<Layout title={title} description={description}>
    <BlogBody>
        <section>
            {
                posts.map((post) => (
                    <a href={`/posts/${post.id}`}>
                        {post.data.heroImage && (
                            <Image width={720} height={360} src={post.data.heroImage} alt="" />
                        )}
                        <h3>{post.data.title}</h3>
                        <Date date={post.data.pubDate} />
                        <p>{post.data.description}</p>
                    </a>
                ))
            }
        </section>
    </BlogBody>
</Layout>
```

```ts {text="src/pages/posts/[...slug].astro"}
---
import { type CollectionEntry, getCollection, render } from 'astro:content';
import Layout from '../../layouts/BaseLayout.astro';
import Date from "../../components/TimeCompo.astro";

export async function getStaticPaths() {
	const posts = await getCollection('posts');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: post,
	}));
}
type Props = CollectionEntry<'post'>;

const post = Astro.props;
const { Content } = await render(post);
---

<Layout {...post.data}>
	<h3>{post.data.title}</h3>
	<Date date={post.data.pubDate} />
	<Content />
</Layout>

```
9. at this stage, important files are completed, continue to create other directories and files, consult with this pages: https://docs.astro.build/ and https://codeberg.org/minsoehan/cloudflare-astro-blog-sample for more.
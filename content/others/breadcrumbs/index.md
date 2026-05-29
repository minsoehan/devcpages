+++
date = '2026-05-29T11:39:54+06:30'
draft = false
title = 'Breadcrumbs'
categories = ['Tech', 'Dev']
tags = ['Hugo', 'Astro', 'Breadcrumbs']
[params.add]
    codeblock = true
+++

Website စာမျက်နှာများတွင် ထိပ်ဆုံး၌ တွေ့ရလေ့ရှိသော _Home >> products >> electrical >> bulbs_ ကဲ့သို့ ရောက်ရှိရာ စာမျက်နှာ၏ လမ်းကြောင်းကို ပြထားသောအရာကို Breadcrumbs ဟု ခေါ်ကြသည်။ [Hugo](https://gohugo.io/) framework တွင် အလွယ်တကူ ဖန်တီးနိုင်သည်။ https://gohugo.io/content-management/sections/#ancestors-and-descendants တွင် **.Ancestors** method ကို အသုံးပြုထားသော အောက်ပါ Breadcrumb partial template နမူနာတစ်ခုကို ဖော်ပြထားသည်။

```html{text="layouts/_partials/breadcrumbs.html"}
<nav aria-label="breadcrumb" class="breadcrumb">
  <ol>
    {{ range .Ancestors.Reverse }}
      <li>
        <a href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
      </li>
    {{ end }}
    <li class="active">
      <a aria-current="page" href="{{ .RelPermalink }}">{{ .LinkTitle }}</a>
    </li>
  </ol>
</nav>
```

ထို template အတွက် အောက်ပါ CSS ကို အသုံးပြု၍ -

```css{text="breadcrumbs.css"}
.breadcrumb ol {
  padding-left: 0;
}

.breadcrumb li {
  display: inline;
}

.breadcrumb li:not(:last-child)::after {
  content: "»";
}
```

ရိုးရှင်းသော Breadcrumbs တစ်ခုကို အလွယ်တကူဖန်းတီးနိုင်သည်။

```text
Home » products » electrical » bulbs
```

[Astro](https://astro.build/) web framework အသုံးပြုသူများအတွက်မူ https://docs.astro-breadcrumbs.kasimir.dev/ ကို အလွယ်တကူ အသုံးပြုနိုင်သည်။ သို့သော် မိမိစိတ်ကြိုက် Astro Breadcrumbs တစ်ခု ဖန်တီးချင်သူများအတွက် အောက်ပါ နမူနာကို အသုံးပြုနိုင်သည်။

```ts{text="BreadcrumbsCompo.astro"}
---
const baseUrl = import.meta.env.BASE_URL;
const pathname = Astro.url.pathname.replace(baseUrl, "");
const segments = pathname.match(/[^\/]+/g) ?? [];
---

<div class="msh-breadcrumbs">
    <span id="goBack">&larr;&hairsp;Back</span>
    <span>:</span>
    <a href={baseUrl}>Home</a>
    {segments.map((segment, index) => {
        const path = segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        return(
            <span>
                {"/"}
                {isLast ? (
                    <span>{segment}</span>
                ) : (
                <a href={`${baseUrl}${path}`}>{segment}</a>
                )}
            </span>
        );
    })}
</div>

<style>
    .msh-breadcrumbs {
        margin-bottom: 1rem;
        overflow: auto;
        white-space: nowrap;
        font-size: 1rem;
        scrollbar-width: none;
        padding: 9px 0;
    }
    #goBack {
        cursor: pointer;
        color: blue;
    }
</style>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const back = document.getElementById('goBack');
        const prev = document.referrer;
        if (!back) return;
        back.addEventListener('click', () => {
            if (prev.startsWith("https://reports.mgmavlca.org") || prev.startsWith("http://localhost:4321")) {
                window.history.back();
            } else {
                window.location.href = "/";
            }
        });
    });
</script>
```

အထက်နမူနာတွင်ပါဝင်သော Frontmatter သည် layout သို့မဟုတ် page level တွင် ထည့်သွင်းလေ့ရှိသော `export const prerender = true;` နှင့်လည်း ကောင်းစွာအလုပ်လုပ်သည်။

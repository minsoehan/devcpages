+++
date = '2025-08-08T16:35:50+06:30'
draft = false
title = 'Build Script for Cloudflare and Hugo'
categories = ['tech', 'script']
tags = ['cloudflare', 'hugo', 'build', 'pagefind']
+++

In Cloudflare Pages → Project Settings → Build Configuration, I can set the Framework preset to `Hugo`, the Build command to `hugo`, and the Build output directory to `public`. That’s the default when selecting Hugo.

However, when using Pagefind, even though I can set the Build command to `hugo && npx pagefind --site "public"`, it’s not quite satisfying. This is because, on every build, Cloudflare runs `hugo`, installs Pagefind, and then runs `npx pagefind --site "public"` again — which takes a long time.

Since I can already do this locally, I’m wondering why it should be so difficult. So instead, I select `None` for the Framework preset and leave both the Build command and the Build output directory blank. Then I run:

```bash
hugo --destination="/path/to/site-folder"
npx pagefind --site "site-folder"
```

After that, I push it to the GitHub repo. It’s a bit more cumbersome, but if I write a script, it’s manageable. The script is:

```bash
#!/bin/dash

# check if root and exit
if [ $(($(id -u))) -eq 0 ]; then
    exit 0
fi
# check if running in terminal or exit
case "$(ps -o stat= -p $$)" in
    *+*) echo "continue..." ;;
    *) notify-send -t 2700 "clean exit" "please run it in terminal"; exit 0 ;;
esac
# check already running or exit
SCRIPTNAME="$(basename -- "$0")"
if pidof -x "$SCRIPTNAME" -o $$ >/dev/null 2>&1; then
    echo "the script is already running. clean exit."
    exit 0
fi

# check input
if echo "$1" | grep "/$" >/dev/null 2>&1; then
    echo "Oops! your input is not clean. Please remove / ending."
    exit 0
fi
if echo "$1" | grep "/*" >/dev/null 2>&1; then
    echo "Oops! your input is not clean. Please remove /* ending."
    exit 0
fi
if echo "$1" | grep "/\ " >/dev/null 2>&1; then
    echo "Oops! your input is not clean. Please remove /  ending."
    exit 0
fi

# START
FULLLINK="$(readlink -f "$1")"

if [ ! -d "$FULLLINK" ]; then
    echo "::: Oops! "$FULLLINK" is not directory or does not exist."; exit 0
fi

SITE="$(basename -- "$FULLLINK")"
PARENTDIR="$(dirname -- "$FULLLINK")"

echo "
"$SITE"
"$PARENTDIR"
"$FULLLINK"
"

read -p "Continue? [Y/n]: " CYN
case $CYN in
    n|no|N|No) echo "::: exit..."; exit 0 ;;
    *) echo "::: continue..." ;;
esac

rm -rf "$FULLLINK"/*
hugo --destination="$FULLLINK" build
cd "$PARENTDIR"
npx pagefind --site "$SITE"

read -p "Continue to git push? [Y/n]: " CGPYN
case $CGPYN in
    n|no|N|No) echo "::: exit..."; exit 0 ;;
    *) echo "::: continue..." ;;
esac

cd "$SITE"

# continue to git push
git add .
git commit -m "updated"
git push
```
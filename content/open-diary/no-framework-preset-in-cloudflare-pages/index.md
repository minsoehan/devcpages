+++
date = '2025-08-07T11:59:50+06:30'
draft = false
title = 'No Framework Preset in Cloudflare Pages Project Setting'
categories = 'open diary'
tags = ['cloudflare', 'hugo', 'website']
+++

2025-08-06 Wednesday: Cloudflare Pages &rarr; project settings &rarr; Build configuration မှာ Framework preset ကို `Hugo` ထားပြီး Build command နေရာမှာ `hugo` နဲ့ Build output directory မှာ `public` ထားလို့ရတယ်။ အဲ့ဒါက `Hugo` ကိုရွေးရင် default ပဲ။ ဒါပေမယ့် Pagefind ကို သုံးတဲ့အခါ Build command ကို `hugo && npx pagefind --site "public"` ထားလို့ရတာမှန်ပေမယ့် စိတ်တိုင်းမကျ။ Cloudflare က တစ်ခါ build လုပ်တိုင်း `hugo` ကို run ပြီး pagefind ကို install လုပ်နေတယ်။ ပြီးတော့မှ `pagefind` ကို ထပ် run ရအုံးမယ်။ ကြာတယ်။ local မှာ လုပ်လို့ရနေမှတော့ ဘာလို့ခက်ခဲနေတော့မလဲ။ Framework preset မှာ `None` ကိုရွေးပြီး Build command နဲ့ Build output directory နှစ်ခုကို blank တွေထားလိုက်။

နောက်ပြီး `hugo --destination="/path/to/site-folder"` နဲ့ `npx pagefind --site "site-folder"` ကို သုံးတယ်။ ပြီးတော့မှ GitHub Repo ထဲကို push လုပ်တယ်။ နည်းနည်းတော့ ပိုရှုပ်သွားသလိုထင်ရပေမယ့် script ရေးထားလိုက်ရင်ရတာပဲ။

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
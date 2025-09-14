+++
date = '2025-08-13T10:54:07+06:30'
draft = false
title = 'Controlling Running a Script'
description = 'Controlling running a Script.'
categories = 'tech'
tags = ['dash', 'script']
[params.add]
    codeblock = true
+++

We often need to run our script avoiding certain situations like the followings.

1. Avoiding running a script as ROOT.
2. Avoiding running a script in background.
3. Avoiding running a script if the script is already running.
4. Avoiding unnecessary remains exist.

&nbsp;
{class="space-one"}

### Avoiding running a script as ROOT

It is undesirable if a script was accidentally run as ROOT while the script is supposed to be run as normal user. To avoid this situation:

```bash
# test if it is running as ROOT and exit.
if [ $(($(id -u))) -eq 0 ]; then
        exit 0
fi
```

&nbsp;
{class="space-one"}

### Avoiding running a script in background

It is undesirable if a script was accidentally run in background by applauncher like wmenu or bemenu while the script is supposed to be run in a terminal interactively. To avoid this situation:

```bash
# test if it is running in terminal or exit.
case "$(ps -o stat= -p $$)" in
    *+*) echo "continue..." ;;
    *) notify-send -t 2700 "clean exit" "please run it in terminal."; exit 0 ;;
esac
```

&nbsp;
{class="space-one"}

### Avoiding running a script if the script is already running

It is undesirable if a script was accidentally run while the script is already running in background or in another terminal. To avoid this situation:

```bash
# test if it is already running or exit.
SCRIPTNAME="$(basename -- "$0")"
if pidof -x "$SCRIPTNAME" -o $$ >/dev/null 2>&1; then
    echo "the script is already running. clean exit."
    exit 0
fi
```

&nbsp;
{class="space-one"}

### Avoiding unnecessary remains exist

It is undesirable if a script was run and unnecessary remains like helper files were left. To avoid this situation:

```bash
# setting trap for cleaning helper files
trap "cleanhelperfiles_func; trap EXIT; exit 0" INT EXIT
cleanhelperfiles_func () {
    local HELPERFILES=""$FILEONE" "$FILETWO""
    local IFS=" "
    for i in $HELPERFILES; do
        if [ -f "$i" ]; then
            rm "$i"
            sleep 0.5
        fi
    done
    # do anything more
    echo "trap @ cleanhelperfiles_fun for INT & EXIT. clean exit"
}
```
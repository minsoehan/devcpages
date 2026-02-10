+++
date = '2026-02-10T11:42:06+06:30'
draft = false
title = 'Sway Per-window Keyboard Layout'
categories = ['tech', 'dash']
tags = ['dash', 'sway', 'xkb']
[params.add]
    codeblock = true
+++

In [Sway](https://swaywm.org/), `swaymsg -m` is to monitor (watch) events. For example, `swaymsg -m -t subscribe '["window"]'` is to watch (monitor) **window** event in Sway. [Sway (5)](https://man.archlinux.org/man/sway.5), [Sway-ipc (7)](https://man.archlinux.org/man/sway-ipc.7.en) and [swaymsg (1)](https://man.archlinux.org/man/swaymsg.1.en) man pages are to read.

Based on event monitoring of `swaymsg -m -t subscribe '["window", "input"]'`, the following script was written to implement **per-window keyboard layout** in sway.

```bash
#!/bin/dash

if [ "$(id -u)" -eq 0 ]; then
    exit 0
fi
trap 'rm "$LOGFI"' EXIT
trap 'exit 0' INT
SCRIPTNAME="$(basename -- "$0")"
if pidof -x "$SCRIPTNAME" -o "$$"; then
    pkill -INT "$SCRIPTNAME"
    exit 0
fi
MSHTD=/tmp/minsoehan.msh.9.d
LOGFI="$MSHTD"/mswaykbd.log
KBID="1:1:AT_Translated_Set_2_keyboard"
mkdir -p "$MSHTD"
echo "0:0" > "$LOGFI"
swaymsg -m -t subscribe '["window", "input"]' | jq -r --unbuffered '
    if .change == "close" then
        "CLOSE:" + (.container.id | tostring)
    elif .change == "focus" then
        "FOCUS:" + (.container.id | tostring)
    elif .input.identifier == "'$KBID'" then
        "KBLCH:" + (.input.xkb_active_layout_index | tostring)
    else
        empty
    end' | while read -r EVENT; do
    TYPE=$(echo "$EVENT" | cut -d ':' -f 1)
    VALU=$(echo "$EVENT" | cut -d ':' -f 2)
    case $(echo "$EVENT" | cut -d ':' -f1) in
        "CLOSE")
            TODELE="$VALU"
            ;;
        "FOCUS")
            PREEVT=$(tail -n 2 "$LOGFI" | head -n 1)
            PRECTN=$(echo "$PREEVT" | cut -d ':' -f 1)
            if [ "$VALU" -eq "$PRECTN" ]; then
                PREKBL=$(echo "$PREEVT" | cut -d ':' -f 2)
            else
                PREKBL=$(grep ^"$VALU": "$LOGFI" | tail -n 1 | cut -d ':' -f 2)
            fi
            if [ -z "$PREKBL" ]; then
                PREKBL=0
            fi
            NOWKBL=$(swaymsg -t get_inputs | jq -r --arg id "$KBID" '.[] | select(.identifier == $id) | .xkb_active_layout_index')
            if [ "$PREKBL" -ne "$NOWKBL" ]; then
                swaymsg input type:keyboard xkb_switch_layout "$PREKBL"
            fi
            echo "${VALU}:${PREKBL}" >> "$LOGFI"
            if [ -n "$TODELE" ]; then
                sed -i "/^${TODELE}:/d" "$LOGFI"
                unset TODELE
            fi
            ;;
        "KBLCH")
            CTNID=$(swaymsg -t get_tree | jq -r '.. | try select(.focused == true) | .id')
            echo "${CTNID}:${VALU}" >> "$LOGFI"
            ;;
    esac
done
```

And the following script is to have keyboard layout id on the status bar:
{class=mt3rem}

```bash
#!/bin/dash

if [ "$(id -u)" -eq 0 ]; then
    exit 0
fi

if [ -n "$2" ] && [ "$1" -eq "$1" ] 2>/dev/null; then
    :
else
    exit 0
fi

MSKI=/dev/shm/mski

trap 'rm -f /dev/shm/mski; pkill -SIGRTMIN+"$1" "$2"' EXIT
trap 'exit 0' INT

SCRIPTNAME="$(basename -- "$0")"
if pidof -xq "$SCRIPTNAME" -o "$$"; then
    pkill -INT "$SCRIPTNAME"
fi

swaymsg -t get_inputs | jq -r '.[] | select(.identifier == "1:1:AT_Translated_Set_2_keyboard").xkb_active_layout_index' > "$MSKI"
pkill -SIGRTMIN+"$1" "$2"

swaymsg -m -t subscribe '["input"]' | jq -r --unbuffered '.input | select(.identifier == "1:1:AT_Translated_Set_2_keyboard").xkb_active_layout_index' | while read INDEX; do
echo "$INDEX" > "$MSKI"
pkill -SIGRTMIN+"$1" "$2"
done

```

The script is to run with two parameters, first is number of SIGRTMIN and second is the script name that is to update statusbar on the fly. For instance, `kbid 4 status`.

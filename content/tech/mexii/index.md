+++
date = '2026-02-10T13:06:34+06:30'
draft = false
title = 'mexii'
categories = ['dash', 'tech']
tags = ['dash', 'script']
[params.add]
    codeblock = true
+++

It is simple but innovative and complicated logic. Movement is in new method by pressing `Enter`. The indicators in the prompt line, `@ [0%]:` shows the direction, `@` is downward and `#` is upward. And `0` is movement lock off, `LOCKED=0` and `1` is movement lock on, `LOCKED=1`. `%` is where input letter is to appear. In this script, the chain of variables acting like toggle and relative switches is the best.

```bash
 > ls-mabc.mexii
   ls-mssii.mexii
   ss-volume.mexii

 @ [0%]: 
```

Usage is simple. Write a script file with filename in format of `ss-*.mexii` or write single lines of commands in a file with `ls-*.mexii` format. No need to set **executable permission** to the files. Then run `mexii` in the directory where `ls-*.mexii` or `ss-*.mexii` file exists.

```bash
#!/bin/dash

if [ "$(id -u)" -eq 0 ]; then
    exit 0
fi
case "$(ps -o stat= -p "$$")" in
    *+*) : ;;
    *) notify-send -t 2700 "clean exit" "please run it in terminal."; exit 0 ;;
esac
SCRIPTNAME="$(basename -- "$0")"
if pidof -xq "$SCRIPTNAME" -o "$$"; then
    echo "the script is already running. clean exit."
    exit 0
fi

trap 'tput cnorm; exit 0' INT
trap 'tput cnorm' EXIT

cd "$PWD"

tput civis

move_func () {
    if [ "$LOCKED" -eq 1 ]; then
        mexecute_func
        return
    fi
    if [ "$DIRECTION" = "@" ]; then
        INDEX=$(( (INDEX+1) % $ILIN ))
    elif [ "$DIRECTION" = "#" ]; then
        INDEX=$(( ((INDEX-1) + $ILIN) % $ILIN ))
    fi
    tput ed
}
chdirection_func () {
    if [ "$LOCKED" -eq 1 ]; then
        LOCKED=0
        return
    fi
    if [ "$DIRECTION" = "@" ]; then
        DIRECTION="#"
    elif [ "$DIRECTION" = "#" ]; then
        DIRECTION="@"
    fi
}
getsel_func () {
    IND=$((INDEX + 1))
    SELITEM=$(echo "$INPUT" | awk -v i="$IND" 'NR==i {print $0}')
    if [ -f "$SELITEM" ]; then
        read -r SSQ < "$SELITEM"
        if echo "$SSQ" | grep -q '.*#.*single.*script.*'; then
            SSCR=1
        else
            SSCR=0
        fi
        ISLINE=0
    else
        ISLINE=1
    fi
}
mexecute_func () {
    getsel_func
    [ "$ISLINE" -eq 0 ] && [ "$SSCR" -eq 0 ] && LOCKED=0
    if [ -f "$SELITEM" ]; then
        if [ "$SSCR" -eq 1 ]; then
            . ./"$SELITEM"
        elif [ "$SSCR" -eq 0 ]; then
            echo "Oops!, it is not a single-script.${EL}"
        fi
    else
        /bin/dash -c "$SELITEM"
    fi | sed -n 1,6p | while read -r LINE; do echo "$(echo "$LINE" | cut -c 1-"$LCOL")${EL}"; done
}
gonext_func () {
    getsel_func
    catfile_func "$SELITEM"
    [ "$SSCR" -eq 1 ] && return
    chinput_func
    INDEX=0
    LOCKED=0
    CATED=1
}
goback_func () {
    lsdir_func
    chinput_func
    INDEX=0
    LOCKED=0
    EDEND=1
    CATED=0
}
check_func () {
    getsel_func
    cat "$SELITEM" | sed -n 1,6p | while read -r LINE; do
        echo "$(echo "$LINE" | cut -c 1-"$LCOL")${EL}"
    done
    tput ed
    LOCKED=0
}

tplctn_func () {
    local DIRECTION="@"
    local LOCKED=0
    local ACTCHA="%"
    local EDEND=0
    local INDEX=0
    local EL=$(tput el)
    local ED=$(tput ed)
    while true; do
        local ILIN=$(echo "$INPUT" | wc -l)
        local TLIN=$(tput lines)
        local TCOL=$(tput cols)
        local LCOL=$((TCOL-3))
        local ALIN=$((TLIN-12))
        if [ "$ILIN" -gt "$ALIN" ]; then
            echo "::: Oops!, input lines are more than limit.${EL}"
            exit 0
        fi
        echo "$EL"
        local NUM=0
        echo "$INPUT" | while read -r LINE; do
            if [ "$NUM" -eq "$INDEX" ]; then
                echo " > ${LINE}${EL}"
            else
                echo "   ${LINE}${EL}"
            fi
            local NUM=$((NUM+1))
        done
        IFS=
        if [ "$EDEND" -eq 1 ]; then
            EDEND=0
            echo -n "${EL}\n ${DIRECTION} [${LOCKED}${ACTCHA}]: ${ED}"
        else
            echo -n "${EL}\n ${DIRECTION} [${LOCKED}${ACTCHA}]: ${EL}"
        fi
        read -r CHA
        if [ -n "$CHA" ]; then
            if [ "$CHA" = " " ]; then
                ACTCHA="%"
            else
                ACTCHA="$CHA"
            fi
        fi
        echo "$EL"
        case "$CHA" in
            "") move_func ;;
            " ") chdirection_func; move_func ;;
            [\\\;]) chdirection_func; move_func ;;
            [dghijklmotuvwyz\/]) LOCKED=1; mexecute_func ;;
            [fn]) gonext_func ;;
            [bp]) goback_func ;;
            [cr]) check_func ;;
            [asx\']) mexecute_func ;;
            [eq]) echo "$ED"; exit 0 ;;
            *) echo "Oops!, invalid input.${EL}" ;;
        esac
        tput cup 0 0
    done
}

catfile_func () {
    if [ ${CATED:-0} -eq 1 ]; then
        echo "Oops!, already in list file."
        return
    fi
    if ! echo "$1" | grep -wq "[ls]s-.*\.mexii"; then
        echo "Oops!, invalid filename format or parameter.${EL}"
        exit 0
    fi
    if [ -f "$1" ]; then
        read -r SSQ < "$1"
        if echo "$SSQ" | grep -q '.*#.*single.*script.*'; then
            echo "Oops!, it is a single-script.${EL}"
            return
        fi
        MTYPE=$(file -b --mime-type "$1")
        if [ "$MTYPE" = "text/plain" ]; then
            INPUT=$(cat "$1" 2>/dev/null | while read -r LINE; do echo "$LINE"; done)
        else
            echo "Oops!, it is not a list file.${EL}"
            exit 0
        fi
    fi
}
lsdir_func () {
    INPUT=$(ls --color=never [ls]s-*.mexii 2>/dev/null | while read -r LINE; do
        MTYPE=$(file -b --mime-type "$LINE")
        if [ "$MTYPE" = "text/plain" ]; then
            echo "$LINE"
        else
            continue
        fi
    done)
}
lsls_func () {
    INPUT=$(ls --color=never ls-*.mexii 2>/dev/null | while read -r LINE; do
        MTYPE=$(file -b --mime-type "$LINE")
        if [ "$MTYPE" = "text/plain" ]; then
            echo "$LINE"
        else
            continue
        fi
    done)
}
lsss_func () {
    INPUT=$(ls --color=never ss-*.mexii 2>/dev/null | while read -r LINE; do
        MTYPE=$(file -b --mime-type "$LINE")
        if [ "$MTYPE" = "text/plain" ]; then
            echo "$LINE"
        else
            continue
        fi
    done)
}
chinput_func () {
    if [ -z "$INPUT" ]; then
        echo "Oops!, input is emtpy.${EL}"
        exit 0
    fi
}

if [ -n "$1" ]; then
    case "$1" in
        ls) lsls_func ;;
        ss) lsss_func ;;
        *) catfile_func "$1" ;;
    esac
    chinput_func
    SSCR=0
else
    lsdir_func
    chinput_func
    SSCR=1
fi
tput cup 0 0 ed
tplctn_func
```

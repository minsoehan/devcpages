+++
date = '2026-01-14T15:38:55+06:30'
draft = false
title = 'mshstatus'
description = 'My first status software for swaybar or similar.'
categories = ['tech', 'dash', 'c']
tags = ['status', 'c', 'dash']
[params.add]
    codeblock = true
+++

For me, it took many years to understand trap and signal for immediate updating in status on a bar like swaybar. According to gnu bash manual, it can be understood that `sleep [n] &` and `wait $!` is key to implement mechanism of immediate trigger in status blocks. Importantly, `wait $!` must be right after `sleep` command with `&` for going into background, for example, `sleep 9 &`:

```bash
...
sleep 9 &
wait $!
...
```

**Note**: `$!` is process id (pid) of previous command.

If Bash is waiting for a command to complete and receives a signal for which a trap has been set, it will not execute the trap until the command completes. If Bash is waiting for an **_asynchronous command via the wait builtin_**, and it receives a signal for which a trap has been set, the wait builtin will **_return immediately_** with an exit status greater than 128, immediately after which the shell executes the trap.  
↳&nbsp;[https://www.gnu.org/software/bash/manual/html_node/Signals.html](https://www.gnu.org/software/bash/manual/html_node/Signals.html)

#### Writing in Dash Script

```sh {text="mshstatus"}
#!/bin/dash

muteupdate_func () {
    MSTATE=$(pactl get-sink-mute @DEFAULT_SINK@)
}
volumeupdate_func () {
    VOLUME=$(pactl get-sink-volume @DEFAULT_SINK@ | awk 'NR==1{print $1 " " $5, $12}')
}
brightnessupdate_func () {
    BRIGHT=$(brightnessctl -m | cut -d, -f4)
}
bnsupdate_func () {
    if [ -f /tmp/minsoehan.msh.9.d/mshbattnotionoff ]; then
        read -r BNSS < /tmp/minsoehan.msh.9.d/mshbattnotionoff
        BNSS=":$BNSS"
    fi
}

muteupdate_func
volumeupdate_func
brightnessupdate_func
bnsupdate_func

trap muteupdate_func RTMIN+1
trap volumeupdate_func RTMIN+2
trap brightnessupdate_func RTMIN+3
trap bnsupdate_func RTMIN+4

COUNTER=0
while true; do

    if [ "$COUNTER" -eq 0 ]; then
        DATETIME=$(date +'%F %A %R - %I:%M %p')
    fi

    read -r BSTAT < /sys/class/power_supply/BAT0/status
    read -r BCAP < /sys/class/power_supply/BAT0/capacity
    BATT="${BSTAT}: ${BCAP}%"
    
    read -r WFSTAT < /sys/class/net/wlo1/operstate
    WIFI=":$WFSTAT"

    printf "%s    %s    %s    %s    %s    %s    %s *  \n" \
        "$MSTATE" "$VOLUME" "$WIFI" "$BNSS" "$BATT" "$DATETIME" "$BRIGHT"

    sleep 5 &
    wait $!

    COUNTER=$(( (COUNTER + 1) % 2 ))
done
```

#### Writing in C Programming Language{class="mt3rem"}

Anyhow, it is more sophisticated and elegant if it is written in C Programming Language.

```c {text="mshcstatus"}
#include <signal.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
volatile sig_atomic_t update_mute = 1;
volatile sig_atomic_t update_volume = 1;
volatile sig_atomic_t update_brightness = 1;
volatile sig_atomic_t update_bns = 1;
void handle_signal(int sig) {
    if (sig == SIGRTMIN + 5) {
        update_mute = 1;
    } else if (sig == SIGRTMIN + 6) {
        update_volume = 1;
    } else if (sig == SIGRTMIN + 7) {
        update_brightness = 1;
    } else if (sig == SIGRTMIN + 8) {
        update_bns = 1;
    }
}
void get_command_output(const char *cmd, char *buffer, size_t size) {
    FILE *fp = popen(cmd, "r");
    if (fp == NULL) {
        snprintf(buffer, size, "err");
        return;
    }
    if (fgets(buffer, size, fp) != NULL) {
        buffer[strcspn(buffer, "\n")] = 0;
    }
    pclose(fp);
}
void get_file_value(const char *path, char *buffer, size_t size) {
    FILE *fp = fopen(path, "r");
    if (fp == NULL) {
        snprintf(buffer, size, "N/A");
        return;
    }
    if (fgets(buffer, size, fp) != NULL) {
        buffer[strcspn(buffer, "\n")] = 0;
    }
    fclose(fp);
}

int main() {
    char bat_status[16] = "", bat_cap[8] = "", bn_state[8] = "", net_state[16] = "", datetime[64] = "";
    char mute_state[16], volume[32] = "", brightness[16] = "";
    int counter = 0;
    signal(SIGRTMIN + 5, handle_signal);
    signal(SIGRTMIN + 6, handle_signal);
    signal(SIGRTMIN + 7, handle_signal);
    signal(SIGRTMIN + 8, handle_signal);

    while (1) {
        get_file_value("/sys/class/net/wlo1/operstate", net_state, sizeof(net_state));
        get_file_value("/sys/class/power_supply/BAT0/status", bat_status, sizeof(bat_status));
        get_file_value("/sys/class/power_supply/BAT0/capacity", bat_cap, sizeof(bat_cap));
        if (update_mute) {
            get_command_output("pactl get-sink-mute @DEFAULT_SINK@", mute_state, sizeof(mute_state));
            update_mute = 0;
        }
        if (update_volume) {
            get_command_output("pactl get-sink-volume @DEFAULT_SINK@ | awk 'NR==1 {print $1, $5, $12}'", volume, sizeof(volume));
            update_volume = 0;
        }
        if (update_brightness) {
            get_command_output("brightnessctl -m | cut -d ',' -f4", brightness, sizeof(brightness));
            update_brightness = 0;
        }
        if (update_bns) {
            get_file_value("/tmp/minsoehan.msh.9.d/mshbattnotionoff", bn_state, sizeof(bn_state));
            update_bns = 0;
        }
        if (counter % 2 == 0) {
            time_t rawtime;
            struct tm *timeinfo;
            time(&rawtime);
            timeinfo = localtime(&rawtime);
            strftime(datetime, sizeof(datetime), "%F %A %R - %I:%M %p", timeinfo);
        }
        printf("%s    %s    :%s    :%s    %s: %s%%    %s    %s *  \n", mute_state, volume, net_state, bn_state, bat_status, bat_cap, datetime, brightness);
        fflush(stdout);
        unsigned int sleep_time = 5;
        while (sleep_time > 0 && !update_mute && !update_volume && !update_brightness && !update_bns) {
            sleep_time = sleep(sleep_time);
        }
        counter++;
        if (counter >= 2) counter = 0;
    }
    return 0;
}
```

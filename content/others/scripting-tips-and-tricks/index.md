+++
date = '2026-02-11T12:06:51+06:30'
draft = false
title = 'Scripting Tips and Tricks'
categories = ['dash', 'bash', 'tech']
tags = ['script', 'trap', 'asynchronous']
[params.add]
    codeblock = true
+++

This is my collection of my tips and tricks for writing Bash or Dash scripts. These are what I understood after many years of using linux and writing the scripts.

#### Immediate Return{class=mt3rem}

If Bash is waiting for a command to complete and receives a signal for which a trap has been set, it will not execute the trap until the command completes. If Bash is waiting for an **asynchronous command via the wait builtin**, and it receives a signal for which a trap has been set, the wait builtin will return immediately with an exit status greater than 128, immediately after which the shell executes the trap.  
↳&nbsp;[https://www.gnu.org/software/bash/manual/html_node/Signals.html](https://www.gnu.org/software/bash/manual/html_node/Signals.html)

Bash သို့မဟုတ် Dash script တွေမှာ command တစ်ခုပြီးအောင် စောင့်နေတဲ့အချိန် trap signal တစ်ခုလက်ခံရရင် ချက်ချင်းတုန့်ပြန်လိမ့်မယ် ထင်ပါသလား။ မဟုတ်ပါဘူး။ တကယ်က script ဟာ လက်ရှိ စောင့်နေတဲ့ command ပြီးမှ လက်ခံရခဲ့တဲ့ trap signal အတိုင်း ဆက်လက်ဆောင်ရွက်ပါတယ်။ ချက်ချင်းတုန့်ပြန်တာမျိုး လိုချင်ရင် command ကို background မှာ run ခိုင်းပြီး wait နဲ့ စောင့်ကြည့်ရပါတယ်။ ဒါကို အထက်စာပိုဒ်မှာ ... waiting for an **asynchronous command via the wait builtin**, ... လို့ ဆိုပါတယ်။ **asynchronous** ဆိုတာ background ကိုဆိုလိုတာပါ။ command အပြီး နောက်ဆုံးမှာ `&` ထည့်ပြီး run ရပါတယ်။ ဥပမာ - `sleep 30 &` ဟာ background မှာ ၃၀ စက္ကန့်ဆိုင်းငံ့နေဖို့ ခိုင်းစေတဲ့ command ဖြစ်ပါတယ်။ ဒီသဘောတရားဟာ status bar တွေလို realtime update လုပ်ဖို့လိုတဲ့ script တွေရေးဖို့ အသုံးဝင်ပါတယ်။

```bash
...
sleep 3 &
wait $!
...
```

See:&nbsp;[mshstatus](/tech/mshstatus)

#### Asynchronous and Self-toggle{class=mt3rem}

Software တစ်ခုကို terminal ထဲမှာ run ကြည့်ရင် Software ဖွင့်လာပေမယ့် terminal နဲ့ software တွဲဆက်နေတာကို တွေ့ပါလိမ့်မယ်။ terminal ထဲမှာ control+c ကို နှိပ်လိုက်ရင် software ပိတ်သွားပါလိမ့်မယ်။ အဲ့သည့်လို တွဲနေတာမျိုး မဖြစ်ချင်ရင်တော့ နောက်ဆုံးမှာ `&` လေးထည့်ပြီး run လိုက်ရုံပါပဲ။ နောက်ဆုံးမှာ `&` ထည့်ပြီး run တာကို asynchronous လို့ခေါ်ပါတယ်။ background မှာ run ခိုင်းခြင်းဖြစ်ပါတယ်။ သို့သော် software တစ်ခုကို app launcher ကနေ run မယ်ဆိုရင် `&` ထည့်ရေး မထည့်ရေး ကိစ္စ အာရုံစိုက်စရာမလိုပါဘူး။ အဲ့သည့် app launcher က software ကို background မှာ run ပေးပါတယ်။ ဒီတော့ script တွေရေးတဲ့ အခါမှာလည်း background မှာ run ရေးကိစ္စကို အခြေအနေအများစုအတွက် အာရုံစိုက်နေစရာမလိုပါ။ background မှာ run ချင်ရင် [wmenu](https://codeberg.org/adnano/wmenu) လို menu launcher ကနေ run လိုက်ရုံသာ ဖြစ်ပါသည်။ ဒီသဘောတရားအရဆိုရင် အောက်မှာပြထားတဲ့ logic ဟာ အရမ်းကောင်းတဲ့ စိတ်ကူးတစ်ခုဖြစ်ပါတယ်။

```bash
...
exitssboard_func () {
    notify-send -t 600 -h string:x-canonical-private-synchronous:ssboard -- " " "closed\n_"
}
trap 'exitssboard_func' EXIT
trap 'exit 0' INT

SCRIPTNAME="$(basename -- "$0")"
if pidof -xq "$SCRIPTNAME" -o "$$"; then
    pkill -INT "$SCRIPTNAME"
    exit 0
fi
...
```

script ကို menu launcher ကနေ background မှာ run လို့ရသလို terminal ထဲမှာ run လို့လည်း ရပါတယ်။ နောက်ပြီး script ဟာ self toggle ဖြစ်နေတာပါပဲ။ တူညီတဲ့ script name တစ်ခုက run နေပြီးသားဖြစ်ရင် အဲ့သည့် script process ဆီကို INT (control+c) signal ပို့လိုက်တာပဲဖြစ်ပါတယ်။ `trap 'exit 0' INT` ဟာ EXIT signal ကိုပါ trap လုပ်မှာဖြစ်တဲ့အတွက် EXIT trap မှာရှိတဲ့ command သို့မဟုတ် function ကိုလည်း တစ်ဆက်တည်း ဆောင်ရွက်သွားမှာ ဖြစ်ပါတယ်။ ဒီနေရာမှာ အောက်က `trap` နှစ်ခုကို နားလည်အောင် ကြည့်ဖို့လိုပါတယ်။

```bash
trap 'exitssboard_func' EXIT
trap 'exit 0' INT
```

#### Replacing Previous Notification and Double Dashes in Options{class=mt3rem}

အပေါ်က နမူနာမှာ `notify-send -t 600 -h string:x-canonical-private-synchronous:ssboard -- " " "closed\n_"` ဟာလည်း မှတ်သားသင့်တဲ့ အရာတစ်ခုဖြစ်ပါတယ်။

```bash
while true; do
    notify-send "Now:" "$(date)"
    sleep 1
done
```

အပေါ်က script ဟာ တစ်စက္ကန့်တိုင်းမှာ notification အသစ်တစ်ခုစီ ပြပေးပါလိမ့်မယ်။ သို့သော် အောက်က နမူနာ script ကတော့ notification တစ်ခုတည်းမှာပဲ date command ရဲ့ second, minute, hour တွေဟာ တစ်ခြားစာသားတွေကို တစ်ဖြတ်ဖြတ်မဖြစ်စေဘဲ (non-flickering) ပြောင်းလဲနေပါလိမ့်မယ်။

```bash
while true; do
    notify-send -h string:x-canonical-private-asynchronous:mynoti "Now:" "$(date)"
    sleep 1
done
```

`mynoti` ဆိုတာကို ကြိုက်ရာနဲ့ အစားထိုးအသုံးပြုလို့ ရပါတယ်။  
↳&nbsp;[https://wiki.archlinux.org/title/Desktop_notifications#Replace_previous_notification](https://wiki.archlinux.org/title/Desktop_notifications#Replace_previous_notification)  
↳&nbsp;[https://wiki.archlinux.org/title/Desktop_notifications](https://wiki.archlinux.org/title/Desktop_notifications)

#### Prevent While Loop Ignoring Interactive Command{class=mt2rem}

command output ကို while loop ထဲ pipe လုပ်ခြင်းဟာ အရမ်းအသုံးဝင်တဲ့ နည်းတစ်ခု ဖြစ်ပါတယ်။ သို့သော် အဲ့သည့် while loop ထဲ ဥပမာ `read -p "Select Number: " SELNUM` ဆိုတာမျိုး interactive command တစ်ခုခု ပါလာပြီဆိုရင်တော့ ထင်သလိုအလုပ်မဖြစ်တော့ပါဘူး။ `read -p "Select Number: " SELNUM` မှာ user input ကို မစောင့်ဆိုင်းဘဲ looping ထဲက နောက်လာမယ့် result ကို feed လုပ်ပါလိမ့်မယ်။ ဥပမာ -

```sh
echo "aaa\nbbb\nccc\nddd" | while read LINE; do
    read -p "Type A Number: " NUM
    echo ""$NUM": "$LINE""
done
```

အထက်မှာပြထားတာတဲ့ script မှာဆိုရင် `read -p "Type A Number: " NUM` နေရာမှာ user input ကို မစောင့်ဘဲ နောက်လာမယ့် result ကို feed လုပ်ပေးလိုက်မှာဖြစ်လို့ aaa ပြီးလာမယ့် bbb နဲ့ ccc ပြီးလာမယ့် ddd တို့ကို feed လုပ်လိုက်တာကြောင့် အောက်ကအတိုင်း ရပါလိမ့်မယ်။

```sh
bbb: aaa
ddd: ccc
```

အဲ့သည့်အခြေအနေကို ကာကွယ်ချင်ရင်တော့ `read -p "Type A Number: " NUM` looping ကွင်းဆက်ထဲက ထုတ်ထားဖို့ပါပဲ။ looping ကွင်းဆက်ကို မကြည့်ဘဲ terminal `/dev/tty` ကို ကြည့်ခိုင်းထားရမှာဖြစ်ပါတယ်။ `command </dev/tty` ကို သုံးရပါတယ်။ အောက်တွင်ကြည့်ပါ။

```sh
echo "aaa\nbbb\nccc\nddd" | while read LINE; do
    read -p "Type A Number: " NUM </dev/tty
    echo ""$NUM": "$LINE""
done
```

ဒါဆိုရင် script ဟာ looping result တစ်ခုစီတိုင်းအတွက် user input ကို စောင့်ဆိုင်းမှတ်သားပြီး အောက်ပါအတိုင်း ပေးပါလိမ့်မယ်။ ဥပမာ `Type A Mumber:` ဆိုတဲ့နေရာတိုင်းမှာ `1`, `2`, `3` နဲ့ `4` တို့ကို တစ်ခါစီရိုက်မယ်ဆိုပါစို့။

```sh
Type A Number: 1
1: aaa
Type A Number: 2
2: bbb
Type A Number: 3
3: ccc
Type A Number: 4
4: ddd
```


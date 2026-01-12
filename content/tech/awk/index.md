+++
date = '2026-01-12T16:20:19+06:30'
draft = false
title = 'AWK Programming Notes'
description = 'Notes for awk programming language.'
categories = ['tech', 'gnu']
tags = ['gnu', 'awk']
[params.add]
    codeblock = true
+++

Awk is a programming language that can handle and manipulate data. Suppose we have the following data file.

```text {text="datafile.txt"}
orange 22.5 0
banana 19.5 12
apple 23.0 0
mango 25.0 30
papaya 22.5 25
```

Print only certain field, first field for instance.

```bash
awk '{print $1}' datafile.txt
```

Print the lines (the whole line, `$0`) with value at third field is greater than 0.

```bash
awk '$3 > 0 {print $0}' datafile.txt
```

Do some maths **_(value at second field is multiplied by value at third field)_** and print.

```bash
awk '$3 > 0 {print $1, $2 * $3}' datafile.txt
```

Print only the lines with value at third field is equal to 0.

```bash
awk '$3 == 0 {print $0}' datafile.txt
```

Print the line that matches given pattern.

```bash
awk '/apple/ {print $0}' datafile.txt
```

Print the line that certain field matches given pattern, exact match and regex match.

```bash
awk '$1 == "apple" {print $0}' datafile.txt
```

```bash
awk '$1 ~ /apple/ {print $0}' datafile.txt
```

Passing variable and matching, and print.

```bash
fruit="apple"
awk -v f=$fruit '$0 ~ f {print $0}' datafile.txt
```

```bash
fruit="apple"
awk -v f=$fruit '$1 ~ f {print $0}' datafile.txt
```

+++
date = '2026-01-12T16:20:19+06:30'
draft = false
title = 'AWK Basic'
description = 'Notes for awk programming language basic usage.'
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

Removing duplicated lines can be done by `sort` and `uniq` commands but it requires **_sorting_** first. If in case of sorting is not undesirable, `awk` can handle it. Suppose the following content.

```text {text="datafile.txt"}
apple 23.0 0
orange 22.5 0
orange 22.5 0
banana 19.5 12
apple 23.0 0
papaya 22.5 25
mango 25.0 30
orange 22.5 0
papaya 22.5 25
```

Print unique lines (removing duplicate lines) with `sort` and `uniq`

```bash
sort -u datafile.txt
```

or

```bash
sort datafile.txt | uniq
```

But in case of without sorting, use `awk`.

```bash
awk '!_[$0]++' datafile.txt
```

The expression `!_[$0]++` is the pattern part of the awk rule. `$0` represents the entire line and `_[$0]` refers to an element in an associative array named `_`, using the current line's content `[$0]` as the index key.

The expression `++` is a **post-increment operator**. It returns the current value of `_[$0]` before it is incremented.

The first time a line is encountered, `_[$0]` is uninitialized, so its value is treated as 0 (false). After this value is retrieved, `_[$0]` is incremented to 1 and stored in memory, marking the line as seen.

The `!` is the **logical NOT operator**. It negates the value returned by the post-increment operation.

1. For the **first occurrence** of a line, the value returned by `_[$0]++` is 0 (false). The `!` operator makes this `!0` which evaluates to **true**.
2. For any **subsequent occurrence** of the same line, `_[$0]` will have a value of 1 (or greater). The value returned by `_[$0]++` is 1 (true). The `!` operator makes this `!1` which evaluates to **false**.

Because the expression `!_[$0]++` is used as the pattern and no explicit action is provided, `awk` uses its default action of printing the current line (`print $0`) only when the pattern evaluates to `true`.

This results in only the first (unique) occurrence of each line being printed to the output, while subsequent duplicates are ignored.

**Note**: This `!_[$0]++` part is a little higher than basic level. `_` is just a name of the associative array, it still works if it is replaced with any other character or name like `!a[$0]++` or even `!line[$0]++`.

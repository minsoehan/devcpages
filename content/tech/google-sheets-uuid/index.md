+++
date = '2026-04-04T10:35:19+06:30'
draft = false
title = 'Generate UUID Google Sheets'
description = 'Generating random key (UUID) in Google Sheets'
categories = ['tech', 'script']
tags = ['google sheets', 'apps script']
[params.add]
  codeblock = true
+++

To generate a unique random key in Google Sheets, you can use built-in functions for simple IDs or Google Apps Script for more robust, permanent identifiers.

### 1. Simple Alphanumeric Key (Formula)

This formula creates an 8-character hexadecimal string. Note that it will refresh every time the sheet recalculates unless you "Paste as values".

```text
=DEC2HEX(RANDBETWEEN(0, 999999999), 8)
```

`RANDBETWEEN` picks a large random number, and `DEC2HEX` converts it into a 0-9/A-F string.

### 2. Truly Unique UUID (Apps Script)

For keys that are virtually guaranteed to never repeat (36 characters), use Google's built-in UUID generator via a script.

- Go to > **Extensions** > **App Scripts**
- Paste the following code:

```javascript
function GETUUID() {
    return Utilities.getUuid();
}
```

Save and go back to your sheet. Use it like a normal formula: `=GETUUID()`.

Formulas like `RAND()` or `RANDBETWEEN()` are "volatile," meaning they change every time you edit the sheet. To keep a key from changing, just **Copy** and **Paste Value Only**.

To make a value "stick" (so it doesn't change every time you edit the sheet), you can't do it purely inside the `=GETUUID()` function. A formula always recalculates.

Instead, you use an `OnEdit` script. This waits for you to type a specific keyword (like "ID") and then replaces it with a permanent UUID.

### The Auto-Replace Script

Go to **Extensions** > **App Scripts** and replace with the following code:

```javascript
function onEdit(e) {
    var range = e.range;
    var value = range.getValue();

    // If you type exactly "ID" in any cell, it replaces it with a permanent UUID
    if (value === "ID") {
        range.setValue(Utilities.getUuid());
    }
}
```

#### How to use it:

- Save the script.
- Go to your sheet and simply type ID into any cell and hit Enter.
- The script will instantly overwrite "ID" with a permanent, static `UUID` string. It is no longer a formula, so it will never change.

#### Defined Range

To define range for the above script:

```javascript
function onEdit(e) {
    var range = e.range;
    var value = range.getValue();
    var col = range.getColumn();
    var row = range.getRow();

    // Check if: 
    // 1. Value is exactly "ID"
    // 2. Column is 6 (which is Column F)
    // 3. Row is 2 or higher (skips header)
    if (value === "ID" && col === 6 && row >= 2) {
        range.setValue(Utilities.getUuid());
    }
}
```

The script will instantly overwrite “ID” with a permanent, static `UUID` string if the cell is at F column and greater then or equal row number 2. It is no longer a formula, so it will never change.

+++
date = '2025-08-24T07:52:22+06:30'
draft = false
title = 'Turning Google Sheets into a Simple JSON API with Google Apps Script'
description = 'Simple Google Sheets JSON API with Google Apps Script.'
categories = ['tech', 'script']
tags = ['google sheets', 'apps script']
+++

Google Sheets isn’t just for storing data—it can also act as a lightweight database for your projects. With a few lines of Google Apps Script, you can transform your spreadsheet into a JSON API that any web app, static site, or script can consume.

In this post, we’ll walk through a script that reads a Google Sheet and serves its content as JSON.

### Why Use Google Sheets as a JSON API? {class="mt3rem"}

- **No extra server required**: Everything runs inside Google Apps Script, hosted by Google.
- **Friendly interface**: Non-technical users can update the data directly in Google Sheets.
- **Free & fast**: For small projects, it’s cost-effective and quick to set up.
- **Integration ready**: Your frontend or external services can fetch structured data via a simple endpoint.

### The Code {class="mt3rem"}

Here’s the complete Google Apps Script function:

```javascript
function doGet(e) {
  var sheetName = e.parameter.sheet || "base"; // default to "base" if not specified
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Sheet not found: " + sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  var headers = data.shift(); // Remove first row (headers)

  var jsonData = data.map(row => {
    let obj = {};
    headers.forEach((key, i) => obj[key] = row[i]);
    return obj;
  });

  return ContentService
    .createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### How It Works {class="mt3rem"}

#### Handles URL parameters

- You can pass ?sheet=SheetName in the URL.
- If no parameter is provided, it defaults to "base".

#### Reads the spreadsheet

- getActiveSpreadsheet() gets the current file.
- getSheetByName(sheetName) fetches the sheet specified by the URL parameter.

#### Extracts headers and data

- The first row is treated as headers (keys).
- Each following row becomes a JSON object, using those headers as property names.

#### Builds JSON output

- Loops through rows, pairing each column with its corresponding header.
- Returns a clean array of objects in JSON format.

### Example {class="mt3rem"}

Suppose the sheet looks like this:

|Name|Age|City|
|----|---|----|
|Alice|25|Yangon|
|Bob|30|Mandalay|
|Carol|28|Naypyidaw|
{class="table-style-one"}

The API endpoint will return like:

```json
[
  { "Name": "Alice", "Age": 25, "City": "Yangon" },
  { "Name": "Bob", "Age": 30, "City": "Mandalay" },
  { "Name": "Carol", "Age": 28, "City": "Naypyidaw" }
]
```

### Deploying as a Web App {class="mt3rem"}

1. Open your **Google Sheet** → **Extensions** > **Apps Script**.
2. Paste the code into the editor.
3. Click **Deploy** > **New deployment**.
4. Choose **Web app**, set access to **Anyone with the link**, then deploy.
5. You’ll get a URL like:

```text
https://script.google.com/macros/s/AKfycbx12345/exec?sheet=base
```

Now, visiting this URL will return JSON data from your sheet.

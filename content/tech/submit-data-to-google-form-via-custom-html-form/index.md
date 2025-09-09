+++
date = '2025-09-09T14:51:16+06:30'
draft = false
title = 'Submit Data to Google Form via Custom Html Form'
categories = ['tech', 'script']
tags = ['javascript', 'google form', 'html']
+++

{{< disclaimer-page >}}
{{< inner-html >}}<b>Disclaimer</b>{{< /inner-html >}}: This post is written purely for educational and exploratory purposes, and as a personal technical record. The method described — submitting data to Google Forms via a custom HTML form — is not officially supported by Google, may stop working without notice, and should not be relied on for production use or sensitive data collection. I do not encourage or endorse misuse, automation of fake submissions, or attempts to bypass login-restricted forms. Please use responsibly and at your own discretion.
{{< /disclaimer-page >}}

Submitting data to Google Form via custom HTML form is basically using POST method. First, get Google From prefilled link and, note the Form ID and **entry.xxxxxxxx** numbers for each input fields. Then structure your HTML form like:
{class="mt1rem"}

### Method 1 {class="mt3rem"}

```html
<iframe id="hiddenIframe" name="hidden_iframe"></iframe>
<form id="yourFormID" target="hidden_iframe" action="https://docs.google.com/forms/u/1/d/e/FORM-ID/formResponse" method="post">
    <label for="entry.12345678">Name:</label>
    <input type="text" name="entry.12345678" value="" required>
    <label for="entry.87654321">PhoneNo:</label>
    <input type="text" name="entry.87654321" value="" required>
    <button type="submit">Submit</button>
</form>
```

In above structure, the input data will be submitted to the google form by default behavior. To bypass Google's **Submission Confirmed** page, it is redirected to hidden iframe using `target="hidden_iframe"`. And use a JavaScript like:

```js
document.getElementById('yourFormID').target = 'hidden_iframe';
const iframe = document.getElementById('hidden_iframe');
if (iframe) {
    iframe.onload = function () {
        // now you can do stuff, such as displaying a message or redirecting to a new page.
    }
}
```

Assuming iframe onload is successful form submission—even though we can not check it without looking at targeted page—we can do stuffs like displaying a message or redirecting to a new page. The same result can be achieved by another way using a js script. Structure like:

### Method 2 {class="mt3rem"}

```html
<form id="yourFormID" target="_blank" action="https://docs.google.com/forms/u/1/d/e/FORM-ID/formResponse">
    <label for="entry.12345678">Name:</label>
    <input type="text" name="entry.12345678" value="" required>
    <label for="entry.87654321">PhoneNo:</label>
    <input type="text" name="entry.87654321" value="" required>
    <button type="submit">Submit</button>
</form>
```

and use a JavaScript like:

```js
// DO NOT set variable like:
// const form.getElementById('yourFormID');
// ensure adding event listener in one straight line like below:
document.getElementById('yourFormID').addEventListener('submit', function(event) {
    event.preventDefault(); // required and important
    fetch(event.action, {
        method: 'POST',
        body: new FormData(event),
        mode: 'no-cors' // required and important
    }).then(() => {
        alert("Form submission is confirmed.");
    }).catch((error) => {
        alert("There was an error submitting form.");
    });
});
```

In above code, the most overlooked tricky part is the first line. The form can not be set variable like:

```js
const form = document.getElementById('yourFormID');
form.addEventListener('submit', function (event) => {
    // stuffs include fetch api are here.
});
```

It only works for submitting data to the form but will not bypass Google's submission confirmed page which will be loaded at a new tab in browser. To get it works properly, the tricky part is using single line like:

```js
document.getElementById('yourFormID').addEventListener('submit', function (event) => {
    // stuffs include fetch api are here.
});
```

See also: https://stackoverflow.com/questions/44012261/getting-around-cors-with-embedded-google-forms

In conclusion, the method 1 is more preferable. How do you think?
{class="mb3rem"}

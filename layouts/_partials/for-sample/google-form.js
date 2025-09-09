document.getElementById('yourFormID').addEventListener('submit', function(event) {
    event.preventDefault();
    fetch(event.action, {
        method: 'POST',
        body: new FormData(event),
        mode: 'no-cors'
    }).then(() => {
        alert("Form submission is confirmed.");
    }).catch((error) => {
        alert("There was an error submitting form.");
    });
});

document.getElementById('yourFormID').target = 'my-response-iframe';
const iframe = document.getElementById('my-response-iframe');
if (iframe) {
    iframe.onload = function () {
        // now you can do stuff, such as displaying a message or redirecting to a new page.
    }
}
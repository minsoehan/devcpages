document.addEventListener('DOMContentLoaded', function () {
    copyLink();
    shareButton();
});

// copy the link to clipboard
function copyLink () {
    const copyLinkBtn = document.querySelectorAll('i.fa-solid.fa-link');
    copyLinkBtn.forEach(b => {
        b.addEventListener('click', (e) => {
            const titleId = e.target.parentElement.id;
            if (!titleId) return;
            const link = `${window.location.origin}${window.location.pathname}#${titleId}`;
            navigator.clipboard.writeText(link);
            alert(`${link}\n\nThe link is copied.`);
        });
    });
}

function shareButton() {
    const shareButton = document.getElementById('shareButton');
    shareButton.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href);
        alert("The link has been copied to clipboard.");
    });
}

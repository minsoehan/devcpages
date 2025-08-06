(() => {
  // <stdin>
  document.addEventListener("DOMContentLoaded", function() {
    copyLink();
  });
  function copyLink() {
    const copyLinkBtn = document.querySelectorAll("i.fa-solid.fa-link");
    copyLinkBtn.forEach((b) => {
      b.addEventListener("click", (e) => {
        const titleId = e.target.parentElement.id;
        if (!titleId) return;
        const link = `${window.location.origin}${window.location.pathname}#${titleId}`;
        navigator.clipboard.writeText(link);
        alert("The link is copied.");
      });
    });
  }
})();

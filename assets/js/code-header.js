const copyButtons = document.querySelectorAll('.code-header .copy-code-below');

copyButtons.forEach(copyBtn => {
    copyBtn.addEventListener('click', () => {
        const pre = copyBtn.nextElementSibling;
        if (!pre) return;

        // Extract the code text
        const codeBlock = pre.querySelector('code');
        let codeText = codeBlock ? codeBlock.innerText : pre.innerText;
        codeText = codeText.trim(); // for removing tailing newline

        // Copy to clipboard
        navigator.clipboard.writeText(codeText).then(() => {
            // Optional feedback (swap icon or add a class)
            // copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
            copyBtn.innerHTML = 'Copied';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
            }, 1500);
        }).catch(err => {
            console.error("Failed to copy code:", err);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const liButtons = document.querySelectorAll('ul.file-tree li');

    liButtons.forEach(liButton => {
        const childUl = liButton.querySelector(':scope > ul'); // direct child <ul>
        
        if (!childUl) return; // skip if no nested list
        
        const toggle = document.createElement('span');
        toggle.textContent = '+';
        toggle.classList.add('toggle');
        liButton.insertBefore(toggle, liButton.firstChild);

        toggle.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent bubbling up
            
            if (childUl.style.display === "none" || childUl.style.display === "") {
                childUl.style.display = 'block';
                toggle.textContent = '-';
            } else {
                childUl.style.display = 'none';
                toggle.textContent = '+';
            }
        });
    });
});

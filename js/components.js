/* ===================================
   CENTRALIZED COMPONENTS LOADER
   ===================================

   This script loads header and footer from centralized files
   to avoid duplication across all pages.
*/

document.addEventListener('DOMContentLoaded', function() {

    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;
                // Dispatch custom event to notify that header is loaded
                document.dispatchEvent(new Event('headerLoaded'));
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
                // Dispatch custom event to notify that footer is loaded
                document.dispatchEvent(new Event('footerLoaded'));
            })
            .catch(error => console.error('Error loading footer:', error));
    }

});

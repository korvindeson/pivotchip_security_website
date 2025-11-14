/* ===================================
   USE CASES PAGE JAVASCRIPT
   ===================================

   Handles:
   - Sidebar navigation between use cases
   - Image modal pop-ups
   - URL hash navigation
*/

document.addEventListener('DOMContentLoaded', function() {

    /* ===================================
       USE CASE NAVIGATION
       =================================== */

    const useCaseLinks = document.querySelectorAll('.use-case-link');
    const useCaseArticles = document.querySelectorAll('.use-case-article');

    // Function to show a specific use case
    function showUseCase(useCaseId) {
        // Hide all articles
        useCaseArticles.forEach(article => {
            article.classList.remove('active');
        });

        // Remove active class from all links
        useCaseLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the selected article
        const targetArticle = document.getElementById(useCaseId);
        if (targetArticle) {
            targetArticle.classList.add('active');

            // Add active class to the corresponding link
            const targetLink = document.querySelector(`[data-use-case="${useCaseId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }

            // Update URL hash
            window.location.hash = useCaseId;

            // Scroll to top of content area smoothly
            const contentArea = document.querySelector('.use-cases-content');
            if (contentArea) {
                contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    // Add click event to all use case links
    useCaseLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const useCaseId = this.getAttribute('data-use-case');
            showUseCase(useCaseId);
        });

        // Add keyboard accessibility
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const useCaseId = this.getAttribute('data-use-case');
                showUseCase(useCaseId);
            }
        });
    });

    // Check URL hash on page load to show specific use case
    if (window.location.hash) {
        const hashUseCaseId = window.location.hash.substring(1);
        showUseCase(hashUseCaseId);
    }

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', function() {
        if (window.location.hash) {
            const hashUseCaseId = window.location.hash.substring(1);
            showUseCase(hashUseCaseId);
        }
    });

    /* ===================================
       IMAGE MODAL FUNCTIONALITY
       =================================== */

    // Create image modal overlay if it doesn't exist
    let imageModalOverlay = document.querySelector('.image-modal-overlay');
    if (!imageModalOverlay) {
        imageModalOverlay = document.createElement('div');
        imageModalOverlay.className = 'image-modal-overlay';
        imageModalOverlay.innerHTML = `
            <div class="image-modal-content">
                <button class="image-modal-close" aria-label="Close image">&times;</button>
                <img src="" alt="">
                <p class="image-modal-caption"></p>
            </div>
        `;
        document.body.appendChild(imageModalOverlay);
    }

    const imageModalContent = imageModalOverlay.querySelector('.image-modal-content');
    const imageModalImg = imageModalOverlay.querySelector('img');
    const imageModalCaption = imageModalOverlay.querySelector('.image-modal-caption');
    const imageModalClose = imageModalOverlay.querySelector('.image-modal-close');

    // Function to open image modal
    function openImageModal(imageSrc, imageAlt, imageCaption) {
        imageModalImg.src = imageSrc;
        imageModalImg.alt = imageAlt;
        imageModalCaption.textContent = imageCaption;

        // Show modal with smooth fade-in
        imageModalOverlay.style.display = 'flex';
        // Force reflow
        imageModalOverlay.offsetHeight;
        imageModalOverlay.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Function to close image modal
    function closeImageModal() {
        // Remove active class to trigger fade-out
        imageModalOverlay.classList.remove('active');

        // Wait for fade-out animation to complete
        setTimeout(() => {
            imageModalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    // Add click event to all use case images
    const useCaseImages = document.querySelectorAll('.use-case-image');

    useCaseImages.forEach(imageContainer => {
        imageContainer.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.image-caption');

            if (img) {
                const imageSrc = img.src;
                const imageAlt = img.alt || '';
                const imageCaptionText = caption ? caption.textContent : '';

                openImageModal(imageSrc, imageAlt, imageCaptionText);
            }
        });

        // Add keyboard accessibility
        imageContainer.setAttribute('tabindex', '0');
        imageContainer.setAttribute('role', 'button');
        imageContainer.setAttribute('aria-label', 'Click to view full-size image');

        imageContainer.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Close modal on close button click
    if (imageModalClose) {
        imageModalClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeImageModal();
        });
    }

    // Close modal on overlay click (but not on image click)
    if (imageModalOverlay) {
        imageModalOverlay.addEventListener('click', function(e) {
            if (e.target === imageModalOverlay) {
                closeImageModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModalOverlay.classList.contains('active')) {
            closeImageModal();
        }
    });

    // Prevent clicks on modal content from closing the modal
    if (imageModalContent) {
        imageModalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

});

/* ===================================
   HOW TO ADD NEW USE CASES
   ===================================

   To add a new use case:

   1. In the HTML sidebar navigation (.use-case-nav), add:
      <a href="#your-use-case-id" class="use-case-link" data-use-case="your-use-case-id">
          <span class="use-case-icon">🔐</span>
          <span class="use-case-title">Your Use Case Title</span>
      </a>

   2. In the main content area (.use-cases-content), add:
      <article id="your-use-case-id" class="use-case-article">
          <div class="use-case-header">
              <span class="use-case-badge">Category</span>
              <h2>Your Use Case Title</h2>
              <p class="use-case-intro">Introduction...</p>
          </div>
          ... your content sections ...
      </article>

   3. The JavaScript above will automatically handle:
      - Switching between use cases
      - URL hash navigation
      - Image modal pop-ups

   No code changes needed!
*/

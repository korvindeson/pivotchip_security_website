/* ===================================
   STATIC WEBSITE TEMPLATE - MAIN JAVASCRIPT
   ===================================

   This file contains all the interactive functionality for the website.
   Main features:
   - Dropdown navigation menu
   - Mobile menu toggle
   - Active page highlighting
   - Smooth scrolling
*/

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {

    // Initialize navigation after header is loaded (if using components system)
    // If header-placeholder exists, wait for headerLoaded event, otherwise init immediately
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        document.addEventListener('headerLoaded', initializeNavigation);
    } else {
        initializeNavigation();
    }

    function initializeNavigation() {

    /* ===================================
       DROPDOWN MENU FUNCTIONALITY
       =================================== */

    // Get all dropdown elements
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');

        // Show dropdown on mouse enter (for desktop)
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                dropdown.classList.add('active');
            }
        });

        // Hide dropdown on mouse leave (for desktop)
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                dropdown.classList.remove('active');
            }
        });

        // Toggle dropdown on click (for mobile and as fallback)
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    /* ===================================
       MOBILE MENU FUNCTIONALITY
       =================================== */

    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            // Change icon between hamburger and X
            const icon = this.textContent;
            this.textContent = icon === '☰' ? '✕' : '☰';
        });

        // Close mobile menu when clicking a link (except dropdown toggles)
        const navLinks = navMenu.querySelectorAll('a:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.textContent = '☰';
                }
            });
        });
    }

    /* ===================================
       ACTIVE PAGE HIGHLIGHTING
       =================================== */

    // Get current page URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Find and highlight the current page in navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');

        // Add active class to current page link
        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }

        // Also highlight parent menu if on a service subpage
        if (currentPage.includes('service-') && linkPage === 'services.html') {
            link.classList.add('active');
        }
    });

    } // End of initializeNavigation function

    /* ===================================
       SMOOTH SCROLLING FOR ANCHOR LINKS
       =================================== */

    // Select all links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Don't prevent default if it's just #
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ===================================
       FORM VALIDATION
       ===================================

       Client-side validation before submitting to getform.io
    */

    const contactForm = document.querySelector('#contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // Simple validation
            if (name && name.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your name');
                name.focus();
                return;
            }

            if (email && email.value.trim() === '') {
                e.preventDefault();
                alert('Please enter your email');
                email.focus();
                return;
            }

            // Basic email validation
            if (email && !isValidEmail(email.value)) {
                e.preventDefault();
                alert('Please enter a valid email address');
                email.focus();
                return;
            }

            if (message && message.value.trim() === '') {
                e.preventDefault();
                alert('Please enter a message');
                message.focus();
                return;
            }

            // If validation passes, form will submit naturally to getform.io
        });
    }

    // Email validation helper function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /* ===================================
       SCROLL-BASED ANIMATIONS (OPTIONAL)
       ===================================

       Uncomment this section to add fade-in animations when scrolling
    */

    /*
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and feature boxes
    const animatedElements = document.querySelectorAll('.card, .feature-box, .team-member');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    */

    /* ===================================
       CLICKABLE CARD MODAL SYSTEM
       ===================================

       This system allows cards to display extended content in a modal
       when clicked. To make a card clickable:

       1. Add the data-modal-content attribute with HTML content
       2. Add data-modal-title for the modal title (optional)
       3. Add data-modal-icon for the modal icon (optional)

       Example:
       <div class="card"
            data-modal-content="<p>Extended content here...</p>"
            data-modal-title="Card Title"
            data-modal-icon="🔍">
           ...card content...
       </div>
    */

    // Create modal overlay element (if it doesn't exist)
    let modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-header"></div>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    const modalContent = modalOverlay.querySelector('.modal-content');
    const modalHeader = modalOverlay.querySelector('.modal-header');
    const modalBody = modalOverlay.querySelector('.modal-body');
    const modalClose = modalOverlay.querySelector('.modal-close');

    // Function to open modal
    function openModal(title, icon, content) {
        // Set header
        let headerHTML = '';
        if (icon) {
            headerHTML += `<div class="card-icon">${icon}</div>`;
        }
        if (title) {
            headerHTML += `<h2>${title}</h2>`;
        }
        modalHeader.innerHTML = headerHTML;

        // Set body content
        modalBody.innerHTML = content;

        // Show modal with smooth fade-in animation
        modalOverlay.style.display = 'flex';
        // Force reflow to ensure display change takes effect before animation
        modalOverlay.offsetHeight;
        modalOverlay.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Function to close modal with smooth fade-out
    function closeModal() {
        // Remove active class to trigger fade-out animation
        modalOverlay.classList.remove('active');

        // Wait for fade-out animation to complete before hiding
        setTimeout(() => {
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); // Match CSS transition duration
    }

    // Add click event to all cards and feature boxes with data-modal-content
    const clickableCards = document.querySelectorAll('[data-modal-content]');

    clickableCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a link inside the card
            if (e.target.tagName === 'A') {
                return;
            }

            const content = this.getAttribute('data-modal-content');
            const title = this.getAttribute('data-modal-title') ||
                         this.querySelector('h3')?.textContent ||
                         this.querySelector('h4')?.textContent || '';
            const icon = this.getAttribute('data-modal-icon') ||
                        this.querySelector('.card-icon')?.textContent ||
                        this.querySelector('.feature-icon')?.textContent || '';

            openModal(title, icon, content);
        });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal on overlay click (but not on content click)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    /* ===================================
       IMAGE LIGHTBOX FUNCTIONALITY
       ===================================

       Makes images clickable with zoom functionality
       Add class "lightbox-image" to any image to enable
    */

    // Function to open image in lightbox
    function openImageLightbox(imageSrc, imageAlt) {
        modalHeader.innerHTML = '';
        modalBody.innerHTML = `
            <div class="lightbox-image-container">
                <img src="${imageSrc}" alt="${imageAlt || 'Image'}" class="lightbox-image-full">
            </div>
        `;

        // Show modal
        modalOverlay.style.display = 'flex';
        modalOverlay.offsetHeight;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Add click handlers to lightbox images and screenshot placeholders
    function attachLightboxHandlers() {
        const lightboxImages = document.querySelectorAll('.lightbox-image, [data-lightbox-placeholder]');
        lightboxImages.forEach(element => {
            element.style.cursor = 'pointer';
            element.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Check if it's a placeholder
                if (this.hasAttribute('data-lightbox-placeholder')) {
                    const placeholderTitle = this.getAttribute('data-lightbox-placeholder') || 'Screenshot Placeholder';
                    openPlaceholderLightbox(placeholderTitle);
                } else {
                    // Regular image
                    const imageSrc = this.src || this.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    const imageAlt = this.alt || this.getAttribute('aria-label') || '';
                    openImageLightbox(imageSrc, imageAlt);
                }
            });
        });
    }

    // Function to open placeholder in lightbox
    function openPlaceholderLightbox(title) {
        modalHeader.innerHTML = '<h2>' + title + '</h2>';
        modalBody.innerHTML = `
            <div class="lightbox-image-container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 3rem;">
                <div style="text-align: center; color: white;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📸</div>
                    <h3 style="color: white; margin-bottom: 1rem;">Screenshot Placeholder</h3>
                    <p style="font-size: 1.1rem; line-height: 1.8; max-width: 600px; margin: 0 auto;">
                        This is a placeholder for an actual screenshot. In production, you would replace this with
                        real screenshots showing the functionality described in the section.
                    </p>
                    <p style="margin-top: 1.5rem; font-size: 0.9rem; opacity: 0.9;">
                        Click the X or press ESC to close
                    </p>
                </div>
            </div>
        `;

        // Show modal
        modalOverlay.style.display = 'flex';
        modalOverlay.offsetHeight;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Attach handlers on page load
    attachLightboxHandlers();

    /* ===================================
       IFRAME REPORT PREVIEW FUNCTIONALITY
       ===================================

       Creates scrollable iframe preview for HTML reports
       Add data-report-preview attribute with URL to enable
    */

    function openReportPreview(reportUrl, reportTitle) {
        modalHeader.innerHTML = reportTitle ? `<h2>${reportTitle}</h2>` : '<h2>Report Preview</h2>';
        modalBody.innerHTML = `
            <div class="report-preview-container">
                <iframe src="${reportUrl}" class="report-preview-iframe" frameborder="0"></iframe>
            </div>
        `;

        // Show modal
        modalOverlay.style.display = 'flex';
        modalOverlay.offsetHeight;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Add click handlers to report preview elements
    function attachReportPreviewHandlers() {
        const reportPreviewElements = document.querySelectorAll('[data-report-preview]');
        reportPreviewElements.forEach(element => {
            element.style.cursor = 'pointer';

            // Handler function
            const handleClick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const reportUrl = element.getAttribute('data-report-preview');
                const reportTitle = element.getAttribute('data-report-title') || 'Security Report Preview';
                openReportPreview(reportUrl, reportTitle);
            };

            // Add both capture and bubble phase listeners for maximum browser compatibility
            element.addEventListener('click', handleClick, false); // Bubble phase
            element.addEventListener('click', handleClick, true);  // Capture phase

            // Also add to any iframes inside to catch clicks that might get through
            const iframe = element.querySelector('iframe');
            if (iframe) {
                iframe.addEventListener('click', handleClick, false);
                iframe.addEventListener('click', handleClick, true);
            }

            // Add keyboard accessibility
            element.setAttribute('tabindex', '0');
            element.setAttribute('role', 'button');
            element.setAttribute('aria-label', 'Click to view full report');

            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e);
                }
            });
        });
    }

    // Attach handlers on page load
    attachReportPreviewHandlers();

});

/* ===================================
   HOW TO EXTEND THE NAVIGATION
   ===================================

   To add a new page to the navigation:

   1. Add a new <li> element in the <ul class="nav-menu"> in your HTML files
   2. For a regular link:
      <li><a href="new-page.html">New Page</a></li>

   3. For a dropdown menu:
      <li class="dropdown">
          <a href="#" class="dropdown-toggle">Menu Name</a>
          <ul class="dropdown-menu">
              <li><a href="page1.html">Page 1</a></li>
              <li><a href="page2.html">Page 2</a></li>
          </ul>
      </li>

   4. To add a new item to an existing dropdown:
      Simply add a new <li><a> inside the <ul class="dropdown-menu">

   5. To reorder menu items:
      Just move the <li> elements in the HTML to the desired order

   No JavaScript changes are needed - the code above handles everything automatically!
*/

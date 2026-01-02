# Static Website Template

A complete, modular static website template built with vanilla HTML, CSS, and JavaScript. Designed for easy customization and deployment as a static site.

## 📋 Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Customization Guide](#customization-guide)
- [Adding/Modifying Pages](#addingmodifying-pages)
- [Navigation Menu](#navigation-menu)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [License](#license)

## ✨ Features

- **Fully Static**: No server-side processing required - can be hosted on any static hosting service
- **Modular Design**: Easy to add, remove, or modify pages
- **CSS Variables**: Centralized theme customization with CSS custom properties
- **Responsive**: Mobile-first design that works on all screen sizes
- **Dropdown Navigation**: Built-in support for dropdown menus
- **Semantic HTML5**: Clean, accessible markup
- **Well Commented**: Extensive comments explaining how to customize
- **No Dependencies**: Pure HTML/CSS/JS with no frameworks required

## 📁 Folder Structure

```
pivotchip_website/
├── css/
│   └── styles.css          # Main stylesheet with CSS variables
├── js/
│   └── main.js             # JavaScript for navigation and interactions
├── images/                 # Place your images here
├── assets/
│   └── icons/             # Place icons and small graphics here
├── index.html             # Home page
├── about.html             # About Us page
├── services.html          # Services main page
├── service-penetration-testing.html    # Service sub-page example 1
├── service-security-audit.html         # Service sub-page example 2
├── service-cybersecurity-training.html      # Service sub-page example 3
├── ethical-use-policy.html            # Ethical Use Policy page
├── contact.html           # Contact page
└── README.md             # This file
```

## 🚀 Getting Started

### Option 1: Direct File Opening

1. Clone or download this repository
2. Open `index.html` in a web browser
3. Navigate through the site using the menu

### Option 2: Local Web Server (Recommended)

Using Python 3:
```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

Using Node.js (with npx):
```bash
npx serve
```

### Option 3: Deploy to Static Hosting

Deploy to any of these services:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Push to a GitHub repo and enable Pages
- **AWS S3**: Upload files to an S3 bucket configured for static hosting
- **Cloudflare Pages**: Connect your Git repository

## 🎨 Customization Guide

### Changing Colors and Branding

All theme colors are defined as CSS variables in `css/styles.css`. Open the file and modify the `:root` section:

```css
:root {
    /* PRIMARY COLORS - Change these to rebrand the site */
    --primary-color: #2c3e50;        /* Main brand color */
    --primary-light: #34495e;        /* Lighter version */
    --primary-dark: #1a252f;         /* Darker version */
    --accent-color: #3498db;         /* Accent color */
    --accent-hover: #2980b9;         /* Accent hover state */

    /* Modify other colors as needed */
}
```

**Quick Color Changes:**
1. Open `css/styles.css`
2. Find the `:root` section (lines 18-40)
3. Replace color values (use hex, rgb, or color names)
4. Save the file - changes apply to entire site

### Changing Fonts

To change fonts, modify these variables in `css/styles.css`:

```css
:root {
    --font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --font-heading: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

**To use Google Fonts:**
1. Go to [Google Fonts](https://fonts.google.com)
2. Select your fonts and copy the `<link>` tag
3. Add it to the `<head>` section of each HTML file
4. Update the CSS variables with your font names

Example:
```html
<!-- In HTML <head> -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
```

```css
/* In CSS */
--font-primary: 'Roboto', sans-serif;
```

### Changing the Logo

**Option 1: Text Logo (Current)**
- Open each HTML file
- Find `<a href="index.html" class="logo">CyberSecure</a>`
- Replace "CyberSecure" with your company name

**Option 2: Image Logo**
1. Place your logo image in the `images/` folder (e.g., `logo.png`)
2. Replace the logo HTML in each file:

```html
<!-- Before -->
<a href="index.html" class="logo">CyberSecure</a>

<!-- After -->
<a href="index.html" class="logo">
    <img src="images/logo.png" alt="Your Company" style="height: 40px;">
</a>
```

### Changing Spacing and Layout

Modify spacing variables in `css/styles.css`:

```css
:root {
    --spacing-xs: 0.5rem;    /* 8px */
    --spacing-sm: 1rem;      /* 16px */
    --spacing-md: 1.5rem;    /* 24px */
    --spacing-lg: 2rem;      /* 32px */
    --spacing-xl: 3rem;      /* 48px */
    --max-width: 1200px;     /* Maximum content width */
}
```

## 📄 Adding/Modifying Pages

### Creating a New Page

1. **Copy an existing page** (e.g., `about.html`) as a template
2. **Rename it** to your new page name (e.g., `new-page.html`)
3. **Update the page content:**
   - Change the `<title>` tag in the `<head>`
   - Modify the hero section text
   - Replace the main content
4. **Add it to the navigation** (see Navigation Menu section)

### Duplicating a Service Sub-Page

Service sub-pages follow a consistent structure. To add a new service:

1. **Copy** `service-penetration-testing.html`
2. **Rename** to `service-your-service.html`
3. **Modify the content:**
   - Update page title and hero text
   - Change service description
   - Update use cases, technology, and benefits sections
4. **Add to navigation dropdown** (see below)

### Modifying Page Content

Each page follows this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta tags and title -->
</head>
<body>
    <!-- HEADER (copy from any page) -->
    <header class="header">...</header>

    <!-- MAIN CONTENT (customize this) -->
    <main class="main-content">
        <section class="hero">...</section>
        <section class="section">...</section>
    </main>

    <!-- FOOTER (copy from any page) -->
    <footer class="footer">...</footer>

    <script src="js/main.js"></script>
</body>
</html>
```

**Key Classes:**
- `.hero` - Hero section with colored background
- `.section` - Content section with padding
- `.container` - Centers content with max-width
- `.grid` - Responsive grid layout (`.grid-2`, `.grid-3`, `.grid-4`)
- `.card` - Card component with shadow and hover effect
- `.btn` - Button styles (`.btn-primary`, `.btn-secondary`, `.btn-outline`)

## 🧭 Navigation Menu

### Adding a Regular Link

Add a new `<li>` element to the navigation in each HTML file:

```html
<nav>
    <ul class="nav-menu">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <!-- ADD YOUR NEW LINK HERE -->
        <li><a href="new-page.html">New Page</a></li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
</nav>
```

### Adding a Dropdown Menu

To add a dropdown menu:

```html
<li class="dropdown">
    <a href="main-page.html" class="dropdown-toggle">Menu Name</a>
    <ul class="dropdown-menu">
        <li><a href="sub-page-1.html">Sub Page 1</a></li>
        <li><a href="sub-page-2.html">Sub Page 2</a></li>
        <li><a href="sub-page-3.html">Sub Page 3</a></li>
    </ul>
</li>
```

### Adding Items to Existing Dropdown

Find the Services dropdown and add a new item:

```html
<li class="dropdown">
    <a href="services.html" class="dropdown-toggle">Services</a>
    <ul class="dropdown-menu">
        <li><a href="service-penetration-testing.html">Penetration Testing</a></li>
        <li><a href="service-security-audit.html">Security Audits</a></li>
        <li><a href="service-cybersecurity-training.html">Cybersecurity Training</a></li>
        <!-- ADD NEW SERVICE HERE -->
        <li><a href="service-new-service.html">New Service</a></li>
    </ul>
</li>
```

### Reordering Menu Items

Simply rearrange the `<li>` elements in the desired order. The JavaScript automatically handles active states.

### Important: Update All Pages

When modifying navigation, update the `<nav>` section in **ALL HTML files** to keep navigation consistent across the site.

## 📝 Contact Form Integration

The contact form in `contact.html` is non-functional by default (static site). To make it work:

### Option 1: Formspree (Easiest)

1. Sign up at [Formspree.io](https://formspree.io)
2. Create a new form and get your form ID
3. Update the form action in `contact.html`:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option 2: Netlify Forms

1. Deploy to Netlify
2. Add `netlify` attribute to form:

```html
<form id="contact-form" name="contact" netlify>
```

### Option 3: Getform

1. Sign up at [Getform.io](https://getform.io)
2. Create a form and get your endpoint
3. Update form action:

```html
<form id="contact-form" action="https://getform.io/f/YOUR_FORM_ID" method="POST">
```

### Option 4: Custom Backend

Implement your own backend API and update the form to submit to your endpoint.

## 🗺️ Adding a Map

To add a real map to the contact page:

### Google Maps

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the map placeholder in `contact.html`:

```html
<!-- Replace the .map-placeholder div with: -->
<iframe
    src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
    width="100%"
    height="400"
    style="border:0; border-radius: var(--border-radius);"
    allowfullscreen=""
    loading="lazy">
</iframe>
```

## 📱 Responsive Design

The template is fully responsive and works on all screen sizes:

- **Desktop**: Full layout with side-by-side content
- **Tablet**: Adjusted grid layouts
- **Mobile**: Stacked layout with hamburger menu

The mobile menu automatically activates at 768px width or below.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: CSS custom properties (variables) are used extensively. For older browser support (IE11), you would need to use a CSS preprocessor or provide fallback values.

## 🔧 Common Customizations

### Change Footer Content

Edit the footer section in each HTML file:

```html
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>Your Company</h3>
            <p>Your description here...</p>
        </div>
        <!-- More footer sections -->
    </div>
</footer>
```

### Add Social Media Icons

In the footer or contact page, add social links:

```html
<div class="social-links">
    <a href="https://linkedin.com/company/yourcompany">LinkedIn</a>
    <a href="https://twitter.com/yourcompany">Twitter</a>
    <a href="https://github.com/yourcompany">GitHub</a>
</div>
```

### Change Copyright Text

In the footer of each page:

```html
<div class="footer-bottom">
    <div class="container">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
    </div>
</div>
```

### Add Images

1. Place images in the `images/` folder
2. Reference them in HTML:

```html
<img src="images/your-image.jpg" alt="Description">
```

### Modify Button Styles

Buttons use classes like `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`. You can:

1. Change button colors in CSS variables
2. Add new button variants in `css/styles.css`
3. Modify existing button classes

## 📦 Deployment

### Deploy to Netlify

1. Create account at [Netlify](https://netlify.com)
2. Drag and drop your project folder
3. Your site is live!

**Or connect to Git:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Then connect the repo in Netlify dashboard.

### Deploy to GitHub Pages

1. Create a GitHub repository
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```
3. Go to repository Settings → Pages
4. Select source branch (usually `main`)
5. Your site will be at `https://username.github.io/repo-name`

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

## 🛠️ Troubleshooting

### Navigation dropdown not working
- Verify `js/main.js` is linked in your HTML
- Check browser console for JavaScript errors
- Ensure HTML structure matches the dropdown template

### Styles not applying
- Verify `css/styles.css` is linked correctly
- Check for CSS syntax errors
- Clear browser cache

### Mobile menu not appearing
- Verify viewport meta tag is present in `<head>`
- Check that JavaScript is enabled
- Test on actual mobile device or browser dev tools

### Links not working
- Ensure file names match exactly (case-sensitive on some servers)
- Check that all files are in the same directory structure
- Use relative paths (not absolute)

## 📞 Support

For questions or issues with this template:
- Review the comments in the HTML, CSS, and JS files
- Check the troubleshooting section above
- Refer to the customization guide

## 📄 License

This template is provided as-is for use in your projects. Feel free to modify and customize as needed.

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**

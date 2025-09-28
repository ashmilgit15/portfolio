const navToggleButton = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const copyEmailButton = document.getElementById('copyEmail');
const yearSpan = document.getElementById('year');

if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

if (navToggleButton && siteNav) {
    navToggleButton.addEventListener('click', () => {
        const isOpen = siteNav.classList.toggle('open');
        navToggleButton.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav on link click (mobile)
    siteNav.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            siteNav.classList.remove('open');
            navToggleButton.setAttribute('aria-expanded', 'false');
        });
    });
}

if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async () => {
        const email = copyEmailButton.getAttribute('data-email');
        try {
            await navigator.clipboard.writeText(email || '');
            copyEmailButton.textContent = 'Copied!';
            setTimeout(() => (copyEmailButton.textContent = 'Copy email'), 1400);
        } catch (err) {
            console.error('Clipboard failed', err);
            copyEmailButton.textContent = 'Copy failed';
            setTimeout(() => (copyEmailButton.textContent = 'Copy email'), 1400);
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});



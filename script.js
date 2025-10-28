// ============================================
// PORTFOLIO - LIGHTWEIGHT CREATIVE SCRIPT
// ============================================

// DOM Elements
const navToggleButton = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const copyEmailButton = document.getElementById('copyEmail');
const copyPhoneButton = document.getElementById('copyPhone');
const yearSpan = document.getElementById('year');
const loader = document.getElementById('loader');
const cursorGlow = document.querySelector('.cursor-glow');

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 600);
});

// ============================================
// CUSTOM CURSOR (Desktop Only)
// ============================================
if (!isMobile && cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card-3d');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.width = '20px';
            cursorGlow.style.height = '20px';
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const cards = document.querySelectorAll('.card-3d');
    
    sections.forEach(section => {
        section.classList.add('reveal-element');
        observer.observe(section);
    });
    
    cards.forEach((card, i) => {
        card.classList.add('reveal-element');
        card.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(card);
    });
});

// ============================================
// TOUCH FEEDBACK FOR MOBILE
// ============================================
if (isMobile) {
    const cards = document.querySelectorAll('.card-3d');
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        });
        card.addEventListener('touchend', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// NAVIGATION
// ============================================
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

// ============================================
// COPY TO CLIPBOARD
// ============================================
if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async () => {
        const email = copyEmailButton.getAttribute('data-email');
        try {
            await navigator.clipboard.writeText(email || '');
            const originalText = copyEmailButton.textContent;
            copyEmailButton.textContent = '✓ Copied!';
            setTimeout(() => (copyEmailButton.textContent = originalText), 1400);
        } catch (err) {
            console.error('Clipboard failed', err);
            copyEmailButton.textContent = 'Copy failed';
            setTimeout(() => (copyEmailButton.textContent = 'Copy'), 1400);
        }
    });
}

if (copyPhoneButton) {
    copyPhoneButton.addEventListener('click', async () => {
        const phone = copyPhoneButton.getAttribute('data-phone');
        try {
            await navigator.clipboard.writeText(phone || '');
            const originalText = copyPhoneButton.textContent;
            copyPhoneButton.textContent = '✓ Copied!';
            setTimeout(() => (copyPhoneButton.textContent = originalText), 1400);
        } catch (err) {
            console.error('Clipboard failed', err);
            copyPhoneButton.textContent = 'Copy failed';
            setTimeout(() => (copyPhoneButton.textContent = 'Copy'), 1400);
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// YEAR IN FOOTER
// ============================================
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ============================================
// PARALLAX EFFECT ON SCROLL
// ============================================
let ticking = false;
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    if (!ticking && !isMobile) {
        window.requestAnimationFrame(() => {
            // Parallax floating shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.3;
                shape.style.transform = `translateY(${scrollY * speed}px)`;
            });
            
            // Parallax gradient orbs
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, i) => {
                const speed = (i + 1) * 0.05;
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

console.log('🚀 Portfolio Loaded Successfully!');

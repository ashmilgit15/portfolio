// ============================================
// PORTFOLIO - CREATIVE 3D INTERACTIVE SCRIPT
// ============================================

// DOM Elements
const navToggleButton = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const copyEmailButton = document.getElementById('copyEmail');
const copyPhoneButton = document.getElementById('copyPhone');
const yearSpan = document.getElementById('year');
const loader = document.getElementById('loader');
const cursorGlow = document.querySelector('.cursor-glow');

// Detect mobile device early
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// Ensure mobile projects are visible immediately
if (isMobile) {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.section, .card-3d, .card').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    });
}

// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
    }, isMobile ? 800 : 1500); // Faster loading on mobile
});

// ============================================
// CUSTOM CURSOR
// ============================================
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
    
    if (cursorGlow) {
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Enlarge cursor on interactive elements (desktop only)
if (!isMobile) {
    const interactiveElements = document.querySelectorAll('a, button, .card-3d');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorGlow) {
                cursorGlow.style.width = '40px';
                cursorGlow.style.height = '40px';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorGlow) {
                cursorGlow.style.width = '20px';
                cursorGlow.style.height = '20px';
            }
        });
    });
}

// ============================================
// THREE.JS 3D BACKGROUND SCENE
// ============================================
const canvas = document.getElementById('bg-canvas');
let scene, camera, renderer, particles, particleGeometry, particleMaterial;

function initThreeJS() {
    // Skip heavy 3D on very small screens
    if (window.innerWidth < 480) {
        console.log('Small screen detected - simplified 3D mode');
        return;
    }
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile, // Disable antialiasing on mobile for performance
        powerPreference: isMobile ? 'low-power' : 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
    
    // Create particles
    createParticles();
    
    // Create floating geometric shapes
    if (!isMobile) {
        createGeometricShapes();
    }
    
    // Handle resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Animation loop
    animate3D();
}

function createParticles() {
    particleGeometry = new THREE.BufferGeometry();
    // Reduce particle count on mobile
    const particleCount = isMobile ? 300 : 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 100;
        positions[i + 1] = (Math.random() - 0.5) * 100;
        positions[i + 2] = (Math.random() - 0.5) * 100;
        
        // Color gradient from primary to accent
        const t = Math.random();
        colors[i] = 0.39 + t * 0.08;     // R
        colors[i + 1] = 0.40 + t * 0.48; // G
        colors[i + 2] = 0.94 + t * 0.02; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

const geometricShapes = [];

function createGeometricShapes() {
    // Torus
    const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(20, 10, -20);
    scene.add(torus);
    geometricShapes.push({ mesh: torus, rotationSpeed: { x: 0.001, y: 0.002, z: 0 } });
    
    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(8);
    const octaMaterial = new THREE.MeshBasicMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);
    octa.position.set(-25, -15, -30);
    scene.add(octa);
    geometricShapes.push({ mesh: octa, rotationSpeed: { x: 0.002, y: 0.001, z: 0.001 } });
    
    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(6);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x14f195,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(15, -20, -25);
    scene.add(ico);
    geometricShapes.push({ mesh: ico, rotationSpeed: { x: 0.001, y: 0.003, z: 0.002 } });
}

function animate3D() {
    requestAnimationFrame(animate3D);
    
    // Rotate particles
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;
    }
    
    // Rotate geometric shapes
    geometricShapes.forEach(shape => {
        shape.mesh.rotation.x += shape.rotationSpeed.x;
        shape.mesh.rotation.y += shape.rotationSpeed.y;
        shape.mesh.rotation.z += shape.rotationSpeed.z;
    });
    
    // Mouse parallax effect
    if (camera) {
        camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.01 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize Three.js when DOM is ready
if (typeof THREE !== 'undefined') {
    initThreeJS();
}

// ============================================
// GSAP SCROLL ANIMATIONS (Desktop Only)
// ============================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !isMobile) {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach((section, i) => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 50
        }, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Animate cards
    gsap.utils.toArray('.card-3d').forEach((card, i) => {
        gsap.fromTo(card, {
            opacity: 0,
            y: 60,
            rotationX: -15
        }, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'back.out(1.7)'
        });
    });
    
    // Parallax effect for floating shapes
    gsap.utils.toArray('.shape').forEach((shape, i) => {
        gsap.to(shape, {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: (i + 1) * 100,
            ease: 'none'
        });
    });
} else {
    // Mobile or GSAP not loaded: ensure all elements are visible
    console.log(isMobile ? 'Mobile device - skipping GSAP animations' : 'GSAP not loaded - using fallback styles');
    document.querySelectorAll('.section, .card-3d').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
    });
}

// ============================================
// 3D CARD TILT EFFECT (Desktop Only)
// ============================================
if (!isMobile) {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
} else {
    // Add tap feedback for mobile
    const cards = document.querySelectorAll('[data-tilt]');
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

// Trigger counter animation when stats section is visible
const observerOptions = {
    threshold: 0.5
};

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
}, observerOptions);

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

console.log('🚀 Creative Portfolio Loaded Successfully!');



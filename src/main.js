import './style.css'
import Lenis from 'lenis'

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});



// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.spotlight-nav-items');

if (mobileMenuBtn && navLinksContainer) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  // Close menu when a link is clicked
  const navItems = navLinksContainer.querySelectorAll('a');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });
}

// Update Intersection Observer for new Reveal Classes
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15 // Slightly higher threshold for better effect
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('[class*="reveal-"]').forEach(el => {
  observer.observe(el);
});

// Parallax Effects
const parallaxElements = document.querySelectorAll('[data-speed]');

function raf(time) {
  lenis.raf(time);

  // Parallax Logic
  if (parallaxElements.length > 0) {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed'));
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }

  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- 3D Liquid Ocean Background ---
import { initLiquidOcean } from './liquid-ocean.js';
import { initFlipText } from './flip-text.js';
import { initSpotlightNavbar } from './spotlight-navbar.js'; // Import
import { initPerspectiveGrid } from './perspective-grid.js';
import { initPixelatedImageTrail } from './pixelated-trail.js';
import { initGlassDock } from './glass-dock.js';


// Initialize the ocean background
initLiquidOcean();
// Initialize Flip Text
document.addEventListener('DOMContentLoaded', () => {
  // Short timeout to ensure elements are ready/fonts loaded
  setTimeout(initFlipText, 100);
  initSpotlightNavbar();
  initPerspectiveGrid('.perspective-grid-bg');
  initPixelatedImageTrail();
  initGlassDock();
});

// Hero Canvas Animation (Restored)
const canvas = document.getElementById('hero-animation');
if (canvas) {
  const context = canvas.getContext('2d');
  const frameCount = 40;
  const currentFrame = index => `/assets/ezgif-6b5a1366ea11e7b9-png-split/ezgif-frame-${index.toString().padStart(3, '0')}.png`;

  const images = [];
  const frame = { frame: 0 };
  // Resize canvas to match window for full screen fidelity
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Load all images first
  let imagesLoaded = 0;

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
      imagesLoaded++;
      if (imagesLoaded === 1) {
        render(0);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image frame: ${i}`);
    };
    images.push(img);
  }

  const updateImage = index => {
    if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      const img = images[index];

      // Dynamic Cover Logic for Full Screen Video
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      // Calculate scale to COVER the canvas
      let scaleFactor = (canvasRatio > imgRatio ? canvas.width / img.width : canvas.height / img.height) * 1.35;

      const x = (canvas.width / 2) - (img.width / 2) * scaleFactor;
      const y = (canvas.height / 2) - (img.height / 2) * scaleFactor;

      context.drawImage(img, x, y, img.width * scaleFactor, img.height * scaleFactor);
    }
  };

  // Animation Loop
  let lastTime = 0;
  const fps = 12; // Slow cinematic speed
  const interval = 1000 / fps;
  let frameIndex = 0;

  const render = (time) => {
    requestAnimationFrame(render);
    const now = time;
    const delta = now - lastTime;
    if (delta > interval) {
      lastTime = now - (delta % interval);
      updateImage(frameIndex);
      frameIndex = (frameIndex + 1) % frameCount;
    }
  };
}

// Supabase Integration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Form Validation / Handling
// Form Validation / Handling
const form = document.getElementById('leadForm');
const modal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Close Modal Function
const closeModal = () => {
  if (modal) modal.classList.remove('active');
};

if (closeModalBtn) {
  closeModalBtn.addEventListener('click', closeModal);
}

// Close on outside click
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const business = document.getElementById('business').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    try {
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;

      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: name,
            business_type: business,
            phone: phone,
            email: email,
            message: message
          }
        ]);

      if (error) throw error;

      // Show Success Modal instead of Alert
      if (modal) {
        modal.classList.add('active');
      } else {
        alert(`Thanks ${name}! We have received your request.`);
      }

      form.reset();

    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Something went wrong. Please try again or contact us directly.');
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

// Active Link Switching on Scroll (ScrollSpy)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.spotlight-link');


// Run ScrollSpy if we are on the Home Page (detected by presence of hero section)
if (document.querySelector('.hero.section')) {
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // Offset for fixed header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // const sectionHeight = section.offsetHeight; 
      if (scrollPosition >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    // Explicitly handle "Top of Page" = Home
    if (window.scrollY < 100) {
      current = 'home';
    }

    navLinks.forEach(link => {
      // Don't remove active class if it's the external 'About Us' link (unless we wanted to?)
      // Actually, on Home page, 'About Us' is NEVER active unless clicked?
      // But we just removed 'active' from all links. 
      // 'About Us' href="about.html", so it won't match any ID. 
      // So it will correctly lose 'active' class if it had it.

      link.classList.remove('active');
      const href = link.getAttribute('href');

      // If link points to an ID on this page
      if (href && href.includes('#') && href !== '#') {
        const id = href.split('#')[1];
        if (id === current) {
          link.classList.add('active');
        }
      }

      // Special case for Home link href="#" matches 'home' current state
      if (current === 'home' && (href === '#' || href === '/')) {
        link.classList.add('active');
      }
    });
  });
}

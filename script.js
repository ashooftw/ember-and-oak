/* ==========================================================================
   EMBER & OAK — Behavior
   Sections: Nav scroll state -> Mobile menu -> Menu tabs -> Scrollspy
             -> Scroll reveal -> Ember particle canvas
   ========================================================================== */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Nav scroll state (adds background once page scrolls) ---------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Mobile menu toggle ---------- */
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu(){
  mobileMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close the mobile menu whenever a link inside it is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ---------- Menu tabs ---------- */
const tabs = document.querySelectorAll('.menu-tab');
const panels = document.querySelectorAll('.menu-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.querySelector(`.menu-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
  });
});

/* ---------- Scrollspy: highlight the nav link for the section in view ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach(section => spyObserver.observe(section));

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ---------- Ember particle field (hero signature element) ---------- */
const canvas = document.getElementById('embers');
const ctx = canvas.getContext('2d');
let w, h, particles = [];

function resize(){
  const hero = document.querySelector('.hero');
  w = canvas.width = hero.offsetWidth;
  h = canvas.height = hero.offsetHeight;
}
window.addEventListener('resize', resize);
resize();

function makeParticle(){
  return {
    x: Math.random() * w,
    y: h + Math.random() * 100,
    r: Math.random() * 2 + 0.6,
    speed: Math.random() * 0.6 + 0.25,
    drift: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.5 + 0.3,
    flicker: Math.random() * 0.02 + 0.01,
    hue: Math.random() > 0.5 ? '232,163,61' : '232,100,31'
  };
}

const COUNT = 70;
for (let i = 0; i < COUNT; i++){
  const p = makeParticle();
  p.y = Math.random() * h;
  particles.push(p);
}

function renderFrame(){
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
    ctx.shadowColor = `rgba(${p.hue},${p.alpha})`;
    ctx.shadowBlur = 6;
    ctx.fill();
  });
}

function animate(){
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.y -= p.speed;
    p.x += Math.sin(p.y * 0.01) * p.drift;
    p.alpha += (Math.random() - 0.5) * p.flicker;
    p.alpha = Math.max(0.1, Math.min(0.9, p.alpha));
    if (p.y < -10){
      Object.assign(p, makeParticle());
      p.y = h + 10;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
    ctx.shadowColor = `rgba(${p.hue},${p.alpha})`;
    ctx.shadowBlur = 6;
    ctx.fill();
  });
  requestAnimationFrame(animate);
}

if (!reducedMotion) {
  animate();
} else {
  // Respect prefers-reduced-motion: draw a single static frame, no loop.
  renderFrame();
}

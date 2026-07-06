// ============================================================
// ZHONGDE BOILER BANGLADESH — script.js
// ============================================================

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const scrollThreshold = 60;

window.addEventListener('scroll', () => {
  if (window.scrollY > scrollThreshold) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('open');
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ---- AOS (Animate on Scroll) — custom lightweight implementation ----
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.aosDelay || 0;
      setTimeout(() => {
        entry.target.classList.add('aos-animate');
      }, parseInt(delay));
      aosObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('[data-aos]').forEach(el => {
  aosObserver.observe(el);
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.remove('active-link'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active-link');
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ---- Contact Form Submission ----
function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const product = form.product.value;
  const message = form.message.value.trim();
  const company = form.company.value.trim();
  const email = form.email.value.trim();

  // Build WhatsApp message
  const waMsg = [
    `🏭 *New Boiler Enquiry — ZhongDe Bangladesh*`,
    ``,
    `👤 *Name:* ${name}`,
    company ? `🏢 *Company:* ${company}` : null,
    `📱 *Phone:* ${phone}`,
    email ? `📧 *Email:* ${email}` : null,
    `⚙️ *Product:* ${product}`,
    ``,
    `📝 *Requirements:*`,
    message
  ].filter(Boolean).join('\n');

  // Send to WhatsApp
  const waUrl = `https://wa.me/8801941646278?text=${encodeURIComponent(waMsg)}`;
  
  // Update button state
  btn.innerHTML = '<span>✅ Sending to WhatsApp...</span>';
  btn.disabled = true;

  setTimeout(() => {
    window.open(waUrl, '_blank');
    btn.innerHTML = '<span>✅ Enquiry Sent!</span>';
    btn.style.background = 'linear-gradient(135deg, #25d366, #1da851)';
    form.reset();
    
    setTimeout(() => {
      btn.innerHTML = '<span>Send Enquiry</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 600);
}

// ---- Floating WhatsApp pulse on scroll ----
const waFloat = document.getElementById('whatsappFloat');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 300) {
    waFloat.style.transform = 'scale(0.9) translateY(4px)';
  } else {
    waFloat.style.transform = '';
  }
  lastScrollY = currentScrollY;
}, { passive: true });

// ---- Counter animation for hero stats ----
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const startTime = performance.now();
  const suffix = el.dataset.suffix || '';
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe hero stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(num => {
        const text = num.textContent;
        const match = text.match(/(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const suffix = text.replace(/\d+/, '');
          num.dataset.suffix = suffix;
          animateCounter(num, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---- Navbar active link styling ----
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link { color: #ffffff; background: rgba(255,255,255,0.12); }`;
document.head.appendChild(style);

// ---- Image fallback handler ----
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    if (!this.dataset.fallbackApplied) {
      this.dataset.fallbackApplied = 'true';
      // For product icons, show a placeholder
      if (this.classList.contains('product-icon-img')) {
        this.style.opacity = '0.3';
        this.style.filter = 'grayscale(1)';
      }
    }
  });
});

// ---- Console branding ----
console.log('%c🏭 ZhongDe Boiler Bangladesh', 'color:#1a56db;font-size:18px;font-weight:800;font-family:sans-serif');
console.log('%cOfficial Representative — www.zhongdeboiler.com', 'color:#64748b;font-size:11px');

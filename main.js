(function initHeroHoodieParallax() {
  const hero = document.querySelector('.hero-pro');
  const floatEl = document.querySelector('.hero-pro__hoodie-float');
  if (!hero || !floatEl) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const maxShift = 28;
  const tiltScale = 0.075;
  const ease = 0.056;
  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;

  function tick() {
    cx += (tx - cx) * ease;
    cy += (ty - cy) * ease;
    const rx = (-cy * tiltScale).toFixed(3);
    const ry = (cx * tiltScale).toFixed(3);
    floatEl.style.transform =
      `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
    const settled = Math.abs(tx - cx) < 0.08 && Math.abs(ty - cy) < 0.08;
    if (!settled) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = 0;
      if (tx === 0 && ty === 0) floatEl.style.removeProperty('transform');
    }
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  hero.addEventListener(
    'mousemove',
    (e) => {
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      tx = nx * 2 * maxShift;
      ty = ny * 2 * maxShift;
      schedule();
    },
    { passive: true }
  );

  hero.addEventListener('mouseleave', () => {
    tx = 0;
    ty = 0;
    schedule();
  });
})();

document.querySelectorAll('.hot-picks__tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.hot-picks__tab').forEach((t) => {
      t.classList.remove('hot-picks__tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('hot-picks__tab--active');
    tab.setAttribute('aria-selected', 'true');
  });
});

const revealSelector = '.hot-pick, .diff-card, .testi-card';
const revealEls = document.querySelectorAll(revealSelector);

function revealNow(el) {
  el.style.opacity = '1';
  el.style.transform = 'translateY(0)';
}

if (revealEls.length && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealEls.forEach(revealNow);
} else if (revealEls.length && !('IntersectionObserver' in window)) {
  revealEls.forEach(revealNow);
} else if (revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          revealNow(e.target);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}

document.addEventListener('click', (e) => {
  const a = e.target instanceof Element ? e.target.closest('a[href="#"]') : null;
  if (a) e.preventDefault();
});

document.querySelectorAll('form[action="#"]').forEach((form) => {
  form.addEventListener('submit', (e) => e.preventDefault());
});

document.querySelectorAll('use[href]').forEach((useEl) => {
  if (useEl.hasAttribute('xlink:href')) return;
  const href = useEl.getAttribute('href');
  if (href) useEl.setAttribute('xlink:href', href);
});

(function initDiscountNewsletterModal() {
  const trigger = document.getElementById('discount-tab-btn');
  const dialog = document.getElementById('discount-newsletter-dialog');
  const scrim = dialog?.querySelector('.discount-modal__scrim');
  const closeBtn = dialog?.querySelector('.discount-modal__x');
  const emailInput = document.getElementById('discount-modal-email');
  if (!trigger || !dialog) return;

  let lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    dialog.removeAttribute('hidden');
    trigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => {
      emailInput?.focus({ preventScroll: true });
    }, 50);
  }

  function closeModal() {
    dialog.setAttribute('hidden', '');
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.removeProperty('overflow');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  }

  trigger.addEventListener('click', () => {
    if (dialog.hasAttribute('hidden')) openModal();
  });

  scrim?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dialog.hasAttribute('hidden')) {
      e.preventDefault();
      closeModal();
    }
  });
})();

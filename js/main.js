/* ============================================================
   PRO LIQUOR DISCOUNTER — js/main.js
   General UI: mobile nav, navbar, scroll reveal, active link,
   newsletter, back-to-top, footer year, smooth anchor offset.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* ---- Sticky navbar shadow ---- */
    var navbar = document.getElementById('navbar');
    function onScrollNav() {
      if (!navbar) return;
      if (window.scrollY > 10) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ---- Mobile navigation ---- */
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    function closeMobile() {
      if (!mobileMenu || !hamburger) return;
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    function toggleMobile() {
      if (!mobileMenu || !hamburger) return;
      var open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function (e) { e.stopPropagation(); toggleMobile(); });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeMobile);
      });
      document.addEventListener('click', function (e) {
        if (!mobileMenu.classList.contains('open')) return;
        if (!mobileMenu.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) closeMobile();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobile(); });
    }

    /* ---- Active navigation ---- */
    try {
      var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
      document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (href === current || (current === '' && href === 'index.html')) a.classList.add('active');
        a.removeAttribute('aria-current');
        if (a.classList.contains('active')) a.setAttribute('aria-current', 'page');
      });
    } catch (e) { /* ignore */ }

    /* ---- Scroll reveal ---- */
    var revealEls = document.querySelectorAll('.js-reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    /* ---- Back to top ---- */
    var backBtn = document.getElementById('backToTop');
    function onScrollTop() {
      if (!backBtn) return;
      if (window.scrollY > 500) backBtn.classList.add('visible');
      else backBtn.classList.remove('visible');
    }
    window.addEventListener('scroll', onScrollTop, { passive: true });
    onScrollTop();
    if (backBtn) backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---- Footer year ---- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });

    /* ---- Newsletter (no backend: validate + confirm, editable hook) ---- */
    var newsForm = document.getElementById('newsletterForm');
    if (newsForm) {
      newsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('nlName');
        var email = document.getElementById('nlEmail');
        var consent = document.getElementById('nlConsent');
        var err = document.getElementById('nlError');
        var ok = document.getElementById('nlSuccess');
        if (err) err.textContent = '';
        if (ok) ok.style.display = 'none';

        var emailVal = email ? email.value.trim() : '';
        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          if (err) err.textContent = 'Please enter a valid email address.';
          if (email) email.focus();
          return;
        }
        if (consent && !consent.checked) {
          if (err) err.textContent = 'Please confirm you are of legal drinking age.';
          return;
        }
        // EDITABLE INTEGRATION POINT: connect to a newsletter provider here.
        // No data is sent anywhere in this static build.
        if (ok) {
          ok.style.display = 'block';
          ok.textContent = 'Thanks' + (name && name.value.trim() ? ' ' + name.value.trim() : '') + '! Your request has been noted in this demo — connect a provider to store subscriptions.';
        }
        newsForm.reset();
      });
    }

    /* ---- Image fallback: if a local images/*.jpg is missing, swap to inline SVG placeholder ---- */
    var PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b1414"/><stop offset="1" stop-color="#0e0a08"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/><text x="400" y="290" fill="#c9a45c" font-family="Georgia" font-size="34" text-anchor="middle">Pro Liquor Discounter</text><text x="400" y="330" fill="#faf6ec" font-family="Arial" font-size="16" text-anchor="middle">Replace this image in /images/</text></svg>'
    );
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function handler() {
        img.removeEventListener('error', handler);
        if (!img.src.startsWith('data:')) img.src = PLACEHOLDER;
      });
    });
  });
})();

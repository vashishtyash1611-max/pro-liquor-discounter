/* ============================================================
   PRO LIQUOR DISCOUNTER — js/contact.js
   Frontend-only validation + mailto fallback.
   No backend: messages are NOT stored on a server.
   ============================================================ */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'proliquordiscounter@gmail.com';

  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isPhone(v) {
    if (!v) return true; // optional
    return /^[+\d][\d\s().-]{6,}$/.test(v);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var errBox = document.getElementById('contactError');
    var okBox = document.getElementById('contactSuccess');
    var mailtoBtn = document.getElementById('mailtoFallback');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errBox) { errBox.textContent = ''; errBox.style.display = 'none'; }
      if (okBox) { okBox.style.display = 'none'; }

      var name = document.getElementById('cName').value.trim();
      var email = document.getElementById('cEmail').value.trim();
      var phone = document.getElementById('cPhone').value.trim();
      var location = document.getElementById('cLocation').value;
      var subject = document.getElementById('cSubject').value.trim();
      var message = document.getElementById('cMessage').value.trim();

      var errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!email || !isEmail(email)) errors.push('Please enter a valid email address.');
      if (!isPhone(phone)) errors.push('Please enter a valid phone number (or leave it blank).');
      if (!subject) errors.push('Please enter a subject.');
      if (!message || message.length < 10) errors.push('Please enter a message (at least 10 characters).');

      if (errors.length) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.innerHTML = errors.map(function (m) { return '<div>' + m + '</div>'; }).join('');
        }
        return;
      }

      // Build mailto fallback link with prefilled content
      var body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + (phone || '—') +
        '\nStore: ' + (location || 'General Inquiry') + '\n\n' + message;
      var mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('[Website Inquiry] ' + subject) +
        '&body=' + encodeURIComponent(body);

      if (mailtoBtn) {
        mailtoBtn.href = mailto;
        mailtoBtn.style.display = 'inline-flex';
      }

      if (okBox) {
        okBox.style.display = 'block';
        okBox.innerHTML = '<strong>Thanks, ' + escapeHTML(name) + '!</strong> Your message is ready to send via your email app. ' +
          'Click <strong>“Send via Email App”</strong> below to open it addressed to ' + CONTACT_EMAIL + '. ' +
          '<br><span style="font-size:0.88em">Note: this static website does not store messages on a server.</span>';
      }
      // Keep values so the mailto draft matches; do not auto-clear.
      try { window.location.hash = '#contactSuccess'; } catch (e) { /* ignore */ }
    });

    function escapeHTML(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  });
})();

/* ============================================================
   PRO LIQUOR DISCOUNTER — js/age-gate.js
   18+ age verification with localStorage.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'pld_age_verified';
  var backdropId = 'ageGate';
  var deniedId = 'ageDenied';

  function getBackdrop() { return document.getElementById(backdropId); }

  function isVerified() {
    try { return window.localStorage.getItem(STORAGE_KEY) === 'yes'; }
    catch (e) { return false; }
  }

  function setVerified() {
    try { window.localStorage.setItem(STORAGE_KEY, 'yes'); } catch (e) { /* storage unavailable */ }
  }

  function showGate() {
    var backdrop = getBackdrop();
    if (!backdrop) return;
    backdrop.classList.add('show');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var yesBtn = document.getElementById('ageYes');
    if (yesBtn) yesBtn.focus();
  }

  function hideGate() {
    var backdrop = getBackdrop();
    if (!backdrop) return;
    backdrop.classList.remove('show');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function denyEntry() {
    var denied = document.getElementById(deniedId);
    if (denied) denied.style.display = 'block';
    // Keep gate open; do not reveal site content interaction.
  }

  document.addEventListener('DOMContentLoaded', function () {
    var backdrop = getBackdrop();
    if (!backdrop) return;

    if (isVerified()) {
      hideGate();
      return;
    }
    showGate();

    var yesBtn = document.getElementById('ageYes');
    var noBtn = document.getElementById('ageNo');

    if (yesBtn) {
      yesBtn.addEventListener('click', function () {
        setVerified();
        hideGate();
      });
    }
    if (noBtn) {
      noBtn.addEventListener('click', function () {
        denyEntry();
      });
    }

    // Trap focus lightly: keep Tab inside modal while visible
    backdrop.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { /* do not close on escape — require a choice */ e.preventDefault(); }
    });
  });
})();

/* ============================================================
   PRO LIQUOR DISCOUNTER — js/products.js
   EDIT PRODUCT DATA HERE. Sample/demo products — replace with
   real in-store assortment. No prices claimed as live unless verified.
   Each product: { id, name, category, size, price (optional ""), special (bool), image, desc }
   ============================================================ */

var PLD_PRODUCTS = [
  { id: 1,  name: "Sample Premium Whisky",   category: "Whisky",  size: "750 ML",  price: "", special: true,  image: "images/whisky.jpg",  desc: "Sample listing. Smooth, oak-forward whisky style. Confirm availability in store." },
  { id: 2,  name: "Sample Classic Vodka",    category: "Vodka",   size: "750 ML",  price: "", special: false, image: "images/vodka.jpg",   desc: "Sample listing. Clean, versatile vodka style for mixing or sipping." },
  { id: 3,  name: "Sample Amber Rum",        category: "Rum",     size: "750 ML",  price: "", special: false, image: "images/rum.jpg",     desc: "Sample listing. Warm amber rum style with caramel notes." },
  { id: 4,  name: "Sample London Dry Gin",   category: "Gin",     size: "750 ML",  price: "", special: false, image: "images/gin.jpg",     desc: "Sample listing. Botanical gin style, great for classic cocktails." },
  { id: 5,  name: "Sample Reposado Tequila", category: "Tequila", size: "750 ML",  price: "", special: true,  image: "images/tequila.jpg", desc: "Sample listing. Rested tequila style with smooth agave character." },
  { id: 6,  name: "Sample Red Wine",         category: "Wine",    size: "750 ML",  price: "", special: false, image: "images/wine.jpg",    desc: "Sample listing. Medium-bodied red wine style for dinner pairing." },
  { id: 7,  name: "Sample White Wine",       category: "Wine",    size: "750 ML",  price: "", special: false, image: "images/wine.jpg",    desc: "Sample listing. Crisp white wine style, chilled and refreshing." },
  { id: 8,  name: "Sample Lager 12-Pack",    category: "Beer",    size: "12 x 355 ML", price: "", special: true,  image: "images/beer.jpg",    desc: "Sample listing. Easy-drinking lager style multipack." },
  { id: 9,  name: "Sample IPA 6-Pack",       category: "Beer",    size: "6 x 355 ML",  price: "", special: false, image: "images/beer.jpg",    desc: "Sample listing. Hop-forward IPA style for craft fans." },
  { id: 10, name: "Sample Berry Cooler",     category: "Coolers", size: "473 ML",  price: "", special: false, image: "images/coolers.jpg", desc: "Sample listing. Ready-to-drink berry cooler style." },
  { id: 11, name: "Sample Citrus Cooler Mix",category: "Coolers", size: "6 x 355 ML", price: "", special: true, image: "images/coolers.jpg", desc: "Sample listing. Citrus ready-to-drink variety style." },
  { id: 12, name: "Sample Assorted Spirits", category: "Spirits", size: "750 ML",  price: "", special: false, image: "images/spirits.jpg", desc: "Sample listing. Placeholder for assorted spirits — edit in js/products.js." }
];

/* Render + filter logic (used by products.html) */
(function () {
  'use strict';

  function cardHTML(p) {
    var price = p.price ? '<div class="product-price">' + escapeHTML(p.price) + '</div>' : '<div class="product-meta">In-store pricing — contact store</div>';
    var badge = p.special ? '<span class="badge-special">Special</span>' : '';
    return '' +
      '<article class="product-card js-reveal in" data-id="' + p.id + '">' +
        '<div class="product-media">' +
          '<img src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(p.name) + '" loading="lazy">' +
          '<span class="badge-cat">' + escapeHTML(p.category) + '</span>' + badge +
        '</div>' +
        '<div class="product-body">' +
          '<h3>' + escapeHTML(p.name) + '</h3>' +
          '<div class="product-meta">' + escapeHTML(p.category) + ' &bull; ' + escapeHTML(p.size) + '</div>' +
          price +
          '<div class="product-actions">' +
            '<button class="btn btn-dark btn-small" data-view="' + p.id + '">View Details</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function escapeHTML(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function escapeAttr(s) { return escapeHTML(s).replace(/"/g, '&quot;'); }

  function renderList(list) {
    var grid = document.getElementById('productGrid');
    var count = document.getElementById('productCount');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>Try a different search or category.</p></div>';
    } else {
      grid.innerHTML = list.map(cardHTML).join('');
    }
    if (count) count.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    bindDetailButtons();
  }

  function bindDetailButtons() {
    var btns = document.querySelectorAll('[data-view]');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.getAttribute('data-view'), 10);
        openModal(id);
      });
    });
  }

  function openModal(id) {
    var p = (window.PLD_PRODUCTS || []).find(function (x) { return x.id === id; });
    if (!p) return;
    var backdrop = document.getElementById('productModal');
    if (!backdrop) return;
    document.getElementById('pmImage').src = p.image;
    document.getElementById('pmImage').alt = p.name;
    document.getElementById('pmName').textContent = p.name;
    document.getElementById('pmMeta').textContent = p.category + ' • ' + p.size;
    document.getElementById('pmDesc').textContent = p.desc || 'Sample product. Please confirm availability and pricing in store.';
    document.getElementById('pmPrice').textContent = p.price ? p.price : 'Contact store for current pricing';
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    var backdrop = document.getElementById('productModal');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('productGrid');
    if (!grid) return; // only on products page

    window.PLD_PRODUCTS = window.PLD_PRODUCTS || PLD_PRODUCTS;

    var searchInput = document.getElementById('productSearch');
    var pills = document.querySelectorAll('.pill');
    var activeCat = 'All';

    // Deep-link: products.html?cat=Whisky or #whisky
    var initial = getInitialCategory();
    if (initial) activeCat = initial;

    function getInitialCategory() {
      try {
        var params = new URLSearchParams(window.location.search);
        var c = params.get('cat');
        if (c) return capitalize(c);
        var h = window.location.hash.replace('#', '');
        if (h) return capitalize(h);
      } catch (e) { /* ignore */ }
      return null;
    }
    function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

    function applyFilter() {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var list = window.PLD_PRODUCTS.filter(function (p) {
        var matchCat = (activeCat === 'All' || p.category.toLowerCase() === activeCat.toLowerCase());
        var matchQ = (!q || p.name.toLowerCase().indexOf(q) !== -1 || p.category.toLowerCase().indexOf(q) !== -1);
        return matchCat && matchQ;
      });
      renderList(list);
    }

    pills.forEach(function (pill) {
      if (pill.textContent.trim().toLowerCase() === activeCat.toLowerCase()) {
        pills.forEach(function (x) { x.classList.remove('active'); });
        pill.classList.add('active');
      }
      pill.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('active'); });
        pill.classList.add('active');
        activeCat = pill.getAttribute('data-cat') || pill.textContent.trim();
        applyFilter();
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilter);

    var closeBtn = document.getElementById('pmClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    var backdrop = document.getElementById('productModal');
    if (backdrop) backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

    applyFilter();
  });
})();
